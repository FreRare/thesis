#include "ServerConnector.h"

bool isWiFiConnected()
{
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Sensor data posting: Network not connected!");
        return false;
    }
    return true;
}

ServerConnector::ServerConnector(): lowTempNotificationSent(false), highTempNotificationSent(false), lowPhNotificationSent(false), highPhNotificationSent(false),  brokenLightNotificationSent(false), lowWaterNotificationSent(false)
{
    // Set up wifi config
    this->config = new WiFiConfig();
    // COnnect to network
    if (this->connectToNetwork()) {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Successful", 1);
        UIHandler::getInstance()->writeLine("     connection!", 2);
        char systemIdText[SYSTEMID_TEXT_LENGTH + 1];
        sprintf(systemIdText, "Your system ID: %d", this->config->getSystemID());
        UIHandler::getInstance()->writeLine(systemIdText, 3);
        UIHandler::getInstance()->makeScrollingText("Use this ID for registration inside the app!", 4);
    } else {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Connection failed!", 1);
        UIHandler::getInstance()->writeLine("Forgetting network", 2);
        UIHandler::getInstance()->writeLine("and restarting...", 3);
        delay(1000);
        this->config->forgetNetwork();
        ESP.restart();
    }
    
    // Set up NTP time
    this->MYTZ = new Timezone((TimeChangeRule){"CEST", Last, Sun, Mar, 2, 120}, (TimeChangeRule){"CET", Last, Sun, Oct, 3, 60}); // Set up my time zone
    this->timeClient = new NTPClient(this->udpClient, NTP_SERVER_ADDRESS);
    this->timeClient->begin();
    this->syncNTPTime();
}

void ServerConnector::syncNTPTime()
{
    this->timeClient->update();
    time_t epochTime = this->timeClient->getEpochTime();
    setTime(this->MYTZ->toLocal(epochTime));
    Serial.print("Synced time with server:");
    Serial.println(now());
}

ServerConnector::~ServerConnector()
{
    WiFi.disconnect();
    delete this->config;
    delete this->timeClient;
    delete this->MYTZ;
}

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
        this->httpClient.begin(this->client, URL_CONNECTION_CHECK); // begin http connection
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

ConfigData* ServerConnector::updateConfigData(ConfigData* config)
{
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Wifi not connected!");
        return NULL;
    }
    this->httpClient.begin(this->client, URL_CONFIG_UPDATE);
    this->httpClient.addHeader("Content-Type", "application/json");
    char postData[CONFIG_UPDATE_POST_DATA_LENGTH];
    sprintf(postData, "{\"id\":\"%d\"}", this->config->getSystemID());
    postData[CONFIG_UPDATE_POST_DATA_LENGTH-1] = '\0';
    uint16_t responseCode = this->httpClient.POST(postData);
    if (responseCode == HTTP_CODE_OK) {
        String payload = this->httpClient.getString();
        DynamicJsonDocument configDoc(512);
        DeserializationError err = deserializeJson(configDoc, payload);
        if (err) {
            Serial.println("JSON serialization failed!");
            configDoc.clear();
            return nullptr;
        }
        if (configDoc["data"]["error"]) {
            Serial.println("Error from api!");
            configDoc.clear();
            return nullptr;
        }
        config = new ConfigData(configDoc["data"]["config"]["minTemp"], configDoc["data"]["config"]["maxTemp"],
            configDoc["data"]["config"]["minPh"], configDoc["data"]["config"]["maxPh"],
            configDoc["data"]["config"]["ol1On"], configDoc["data"]["config"]["ol1Off"],
            configDoc["data"]["config"]["ol2On"], configDoc["data"]["config"]["ol2Off"],
            configDoc["data"]["config"]["ol3On"], configDoc["data"]["config"]["ol3Off"],
            configDoc["data"]["config"]["feedingTime"], configDoc["data"]["config"]["foodPortions"],
            configDoc["data"]["config"]["samplePeriod"]);
        configDoc.clear();
        return config;
    }else{
        Serial.println("Config update request failed!");
    }
    return nullptr;
}

bool ServerConnector::postSensorData(const SensorData* data)
{
    if (!isWiFiConnected()) {
        return false;
    }
    char sensorDataJson[SESNOR_DATA_POST_LENGTH];
    sprintf(sensorDataJson,
        "{\"id\":\"%d\",\"temp\":\"%2.2f\",\"ph\":\"%2.2f\",\"light\":\"%1d\",\"water\":\"%d\",\"timestamp\":\"%lld\"}",
        this->config->getSystemID(), data->getTemperature(), data->getPh(), data->getLightAmount(), data->getWaterLvl(),
        data->getTimeStamp());
    this->httpClient.begin(this->client, URL_SENSOR_DATA_UPLOAD);
    uint16_t responseCode = this->httpClient.POST(sensorDataJson);
    if (responseCode != HTTP_CODE_OK) {
        Serial.print("Sensor data posting: HTTP error: ");
        Serial.println(responseCode);
        return false;
    }
    Serial.println("Sensor data posted successfully!");
    return true;
}

void ServerConnector::resetNotificationFlags(){
    this->lowTempNotificationSent = false;
    this->highTempNotificationSent = false;
    this->lowPhNotificationSent = false;
    this->highPhNotificationSent = false;
    this->lowWaterNotificationSent = false;
    this->brokenLightNotificationSent = false;
}

void ServerConnector::postErrorCode(const ConfigStatus& status){
    // Checking if we have to send notifications to the give status, these statuses only should be sent once a day
    switch(status){
        case ConfigStatus::LOW_TEMP:
            if(!this->lowTempNotificationSent){
                this->lowTempNotificationSent = true;
            }else{
                return;
            }
            break;
        case ConfigStatus::HIGH_TEMP:
            if(!this->highTempNotificationSent){
                this->highTempNotificationSent = true;
            }else{
                return;
            }
            break;
        case ConfigStatus::LOW_PH:
            if(!this->lowPhNotificationSent){
                this->lowPhNotificationSent = true;
            }else{
                return;
            }
            break;
        case ConfigStatus::HIGH_PH:
            if(!this->highPhNotificationSent){
                this->highPhNotificationSent = true;
            }else{
                return;
            }
            break;
        case ConfigStatus::LOW_WATER:
            if(!this->lowWaterNotificationSent){
                this->lowWaterNotificationSent = true;
            }else{
                return;
            }
            break;
        case ConfigStatus::BROKEN_LIGHT:
            if(!this->brokenLightNotificationSent){
                this->brokenLightNotificationSent = true;
            }else{
                return;
            }
            break;
        default:
            return;
    }
    Serial.println("Sending notification to server...");
    if (!isWiFiConnected()) {
        Serial.println("No WiFi connected!");
        return;
    }
    char notificationDataJSON[NOTIFICATION_DATA_LENGTH];
    sprintf(notificationDataJSON, "{\"id\":\"%3d\",\"status\":\"%3d\"}", this->config->getSystemID(), status);
    notificationDataJSON[NOTIFICATION_DATA_LENGTH-1] = '\0';
    Serial.print("Sending notification body: ");
    Serial.println(notificationDataJSON);
    this->httpClient.begin(this->client, URL_NOTIFICATION);
    uint16_t responseCode = this->httpClient.POST(notificationDataJSON);
    if(responseCode != HTTP_CODE_OK){
        Serial.print("Sensor data posting: HTTP error: ");
        Serial.println(responseCode);
        return;
    }
    Serial.println("Successfully sent notification!");
}

void ServerConnector::ATCLog(char* str)
{
    if (!isWiFiConnected()) {
        Serial.println("No WiFi connected, couldn't send log!");
        return;
    }
    uint16_t msgLength = 0U;
    while (str[msgLength] != '\0') {
        msgLength++;
    }

    char logData[msgLength + 13];
    sprintf(logData, "{\"id\":\"%3d\",\"log\":\"%s\"}", this->config->getSystemID(), str);
    this->httpClient.begin(this->client, URL_POST_LOG);
    uint16_t response = this->httpClient.POST(logData);
    if (response != HTTP_CODE_OK) {
        Serial.print("Cannot post LOG!");
        Serial.println(response);
    }
}

bool ServerConnector::checkForFactoryReset() { 
    char requestMsg[13];
    sprintf(requestMsg, "{\"id\":\"%3d\"}", this->config->getSystemID());
    requestMsg[12] = '\0';

    this->httpClient.begin(this->client, URL_FACTORY_RESET_CHECK);
    uint16_t response = this->httpClient.POST(requestMsg);
    if(response != HTTP_CODE_OK){
        Serial.println("Factory reset network request failed!");
        Serial.print("Network code: ");
        Serial.println(response);
        return false;
    }else{
        String payload = this->httpClient.getString();
        Serial.println("Received response form server:");
        Serial.println(payload);
        if(payload == "Delete"){
            Serial.println("Received delete response. Initializing factory reset...");
            return true;
        }else{
            return false;
        }
    }
}

void ServerConnector::disconnect() { WiFi.disconnect(); }