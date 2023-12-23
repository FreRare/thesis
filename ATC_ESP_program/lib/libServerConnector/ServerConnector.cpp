#include "ServerConnector.h"

const char* ServerConnector::connectionCheckPath = "http://atc.takacsnet.hu/CONTROLS/aquarium/connectionCheck.php";
const char* ServerConnector::sensorDataUploadPath = "http://atc.takacsnet.hu/CONTROLS/aquarium/sensorDataUpload.php";
const char* ServerConnector::notificationPath = "http://atc.takacsnet.hu/CONTROLS/notification/notification.php";
const char* ServerConnector::configUpdatePath = "http://atc.takacsnet.hu/CONTROLS/aquarium/getAquariumConfig.php";

ServerConnector::ServerConnector()
{
    this->timeClient = new NTPClient(this->ntpUDP, NTP_SERVER_ADDRESS);
    this->config = new AQWiFiConfig();
    if (this->connectToNetwork()) {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Successful", 1);
        UIHandler::getInstance()->writeLine("     connection!", 2);
        char systemIdText[SYSTEMID_TEXT_LENGTH + 1];
        sprintf(systemIdText, "Your system ID: %d", this->config->getSystemID());
        UIHandler::getInstance()->writeLine(systemIdText, 3);
        UIHandler::getInstance()->makeScrollingText("Use this ID for registration inside the app!", 4, 400, 1);
    } else {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Connection failed!", 1);
        UIHandler::getInstance()->writeLine("Forgetting network", 2);
        UIHandler::getInstance()->writeLine("and restarting...", 3);
        delay(1000);
        this->config->forgetNetwork();
        ESP.restart();
    }
    this->timeClient->begin();
    this->timeClient->setTimeOffset(3600);
    this->syncNTPTime();
}

void ServerConnector::syncNTPTime()
{
    this->timeClient->update();
    time_t epochTime = this->timeClient->getEpochTime();
    setTime(epochTime);
}

ServerConnector::~ServerConnector()
{
    WiFi.disconnect();
    delete this->config;
    delete this->timeClient;
    delete this->config;
}

NTPClient* ServerConnector::getTimeClient() const { return this->timeClient; }

bool ServerConnector::connectToNetwork()
{
    UIHandler::getInstance()->writeLine("Connecting...", 4, 3);
    // Start connection
    WiFi.begin(this->config->getSSID(), this->config->getPassword());
    int connectionTimeout = 0;
    while (WiFi.status() != WL_CONNECTED) {
        // When we reach timeout reset the ESP and try to get credentials again
        if (connectionTimeout == CONN_TIMEOUT) {
            UIHandler::getInstance()->clear();
            UIHandler::getInstance()->writeLine("Connection timeout!", 1);
            UIHandler::getInstance()->writeLine("(2 minutes)", 1, 4);
            UIHandler::getInstance()->makeScrollingText("The device will forget the given network and restart...", 3);
            delay(2000);
            return false;
        }
        delay(2000);
        Serial.println("Connecting...");
        connectionTimeout++;
    }

    // If connection is ok let's check the connection
    if (this->config->getSystemID() == 0) { // If we have no system ID than get one
        this->httpClient.begin(this->client, ServerConnector::connectionCheckPath); // begin http connection
        int httpCode = this->httpClient.GET(); // Perform http POST
        if (httpCode > 0) {
            if (httpCode == HTTP_CODE_OK) { // response is ok
                String payload = this->httpClient.getString();
                DynamicJsonDocument doc(256);
                DeserializationError error = deserializeJson(doc, payload);
                if (error) {
                    Serial.println("Json serialization failure!");
                    return false;
                }
                uint16_t newSystemID = doc["data"]["system_id"];
                this->config->saveSystemID(newSystemID);
                return true;
            } else {
                Serial.print("HTTP error code: ");
                Serial.println(String(httpCode));
                return false;
            }
        } else {
            Serial.println("Connection check failed!");
            return false;
        }
    }
    return true; // We have an ID and we could connect
}

ConfigData* ServerConnector::updateConfigData()
{
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Wifi not connected!");
        return NULL;
    }
    this->httpClient.begin(this->client, ServerConnector::configUpdatePath);
    this->httpClient.addHeader("Content-Type", "application/json");
    char* postData = new char[CONFIG_UPDATE_POST_DATA_LENGTH];
    sprintf(postData, "{\"id\":\"%d\"}", this->config->getSystemID());
    uint16_t responseCode = this->httpClient.POST(postData);
    if (responseCode == HTTP_CODE_OK) {
        String payload = this->httpClient.getString();
        DynamicJsonDocument configDoc(512);
        DeserializationError err = deserializeJson(configDoc, payload);
        if (err) {
            Serial.println("JSON serialization failed!");
            return nullptr;
        }
        if (configDoc["data"]["error"]) {
            Serial.println("Error from api!");
            return nullptr;
        }
        ConfigData* freshConfig
            = new ConfigData(configDoc["data"]["config"]["minTemp"], configDoc["data"]["config"]["maxTemp"],
                configDoc["data"]["config"]["minPh"], configDoc["data"]["config"]["maxPh"],
                configDoc["data"]["config"]["ol1On"], configDoc["data"]["config"]["ol1Off"],
                configDoc["data"]["config"]["ol2On"], configDoc["data"]["config"]["ol2Off"],
                configDoc["data"]["config"]["ol3On"], configDoc["data"]["config"]["ol3Off"],
                configDoc["data"]["config"]["feedingTime"],
                configDoc["data"]["config"]["foodPortions"], configDoc["data"]["config"]["samplePeriod"]);
        return freshConfig;
    }
    return nullptr;
}

bool ServerConnector::postSensorData(const SensorData* data)
{
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Sensor data posting: Network not connected!");
        return false;
    }
    char* sensorDataJson = new char[SESNOR_DATA_POST_LENGTH];
    sprintf(sensorDataJson,
        "{\"id\":\"%d\",\"temp\":\"%2.2f\",\"ph\":\"%2.2f\",\"light\":\"%1d\",\"water\":\"%d\",\"timestamp\":\"%lld\"}",
        this->config->getSystemID(), data->getTemperature(), data->getPh(), data->getLightAmount(), data->getWaterLvl(),
        data->getTimeStamp());
    this->httpClient.begin(this->client, ServerConnector::sensorDataUploadPath);
    uint16_t responseCode = this->httpClient.POST(sensorDataJson);
    if (responseCode != HTTP_CODE_OK) {
        Serial.print("Sensor data posting: HTTP error: ");
        Serial.println(responseCode);
        return false;
    }
    Serial.println("Sensor data posted successfully!");
    return true;
}

void ServerConnector::disconnect() { WiFi.disconnect(); }