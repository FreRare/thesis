#include "ServerConnector.h"

const char* ServerConnector::API_URL = "http://atc.takacsnet.hu/CONTROLS";
const char* ServerConnector::connectionCheckPath = "http://atc.takacsnet.hu/CONTROLS/connectionCheck.php";
const char* ServerConnector::timePath = "http://atc.takacsnet.hu/CONTROLS/getCurrentTime.php";
const char* ServerConnector::sensorDataUploadPath = "http://atc.takacsnet.hu/CONTROLS/sensorDataUpload.php";
const char* ServerConnector::notificationPath = "http://atc.takacsnet.hu/CONTROLS/notification.php";

ServerConnector::ServerConnector()
{
    this->timeClient = new NTPClient(this->ntpUDP, NTP_SERVER_ADDRESS);
    this->config = new AQWiFiConfig();
    if (this->connectToNetwork()) {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Successful", 1);
        UIHandler::getInstance()->writeLine("     connection!", 2);
        char systemIdText[SYSTEMID_TEXT_LENGTH + 1];
        sprintf(systemIdText, "Your system ID: %3d", this->config->getSystemID());
        UIHandler::getInstance()->writeLine(systemIdText, 3);
        UIHandler::getInstance()->makeScrollingText("Use this ID for registration inside the app!", 4, 300, 1);
    } else {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Connection failed!", 1);
        UIHandler::getInstance()->writeLine("Forgetting network", 2);
        UIHandler::getInstance()->writeLine("and restarting...", 3);
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
    delete this->config;
    WiFi.disconnect();
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
    httpClient.end();
    return true; // We have an ID and we could connect
}

void ServerConnector::disconnect() { WiFi.disconnect(); }