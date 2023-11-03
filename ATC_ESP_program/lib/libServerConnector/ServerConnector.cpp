#include "ServerConnector.h"

const String ServerConnector::API_URL = "http://atc.takacsnet.hu/CONTROLS";
const String ServerConnector::connectionCheckPath = "/connectionCheck.php";
const String ServerConnector::timePath = "/getCurrentTime.php";
const String ServerConnector::sensorDataUploadPath = "/sensorDataUpload.php";
const String ServerConnector::notificationPath = "/notification.php";
const String ServerConnector::weekDays[7]
    = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
const String ServerConnector::months[12] = { "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December" };

ServerConnector::ServerConnector()
{
    this->timeClient = new NTPClient(this->ntpUDP, "pool.ntp.org");
    this->config = new AQWiFiConfig();
    if (this->connectToNetwork()) {
        UIHandler::getInstance()->clear();
        UIHandler::getInstance()->writeLine("Successful", 1);
        UIHandler::getInstance()->writeLine("      connection!", 2);
        UIHandler::getInstance()->writeLine("Your system ID: " + String(this->config->getSystemID()), 3);
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
}

ServerConnector::~ServerConnector()
{
    delete this->config;
    WiFi.disconnect();
}

NTPClient* ServerConnector::getTimeClient() const { return this->timeClient; }

bool ServerConnector::connectToNetwork()
{
    UIHandler::getInstance()->writeLine("   Connecting...", 4);
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
        this->httpClient.begin(
            this->client, ServerConnector::API_URL + ServerConnector::connectionCheckPath); // begin http connection
        int httpCode = this->httpClient.GET(); // Perform http POST
        if (httpCode > 0) {
            if (httpCode == HTTP_CODE_OK) { // response is ok
                String payload = this->httpClient.getString();
                Serial.println("Successful conenction check!");
                Serial.println(payload);
                DynamicJsonDocument doc(256);
                DeserializationError error = deserializeJson(doc, payload);
                if (error) {
                    Serial.println("Json serialization failure!");
                }
                uint16_t newSystemID = doc["data"]["system_id"] | 12;
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