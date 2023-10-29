#include "ServerConnector.h"

const String ServerConnector::API_URL = "http://atc.takacsnet.hu/CONTROLS";
const String ServerConnector::connectionCheckPath = "/connectionCheck.php";
const String ServerConnector::timePath = "/getCurrentTime.php";
const String ServerConnector::sensorDataUploadPath = "/sensorDataUpload.php";
const String ServerConnector::notificationPath = "/notification.php";

ServerConnector::ServerConnector() { }

uint16_t ServerConnector::connectToNetwork(const String& ssid, const String& pass, const uint16_t& systemID)
{
    // Start connection
    WiFi.begin(ssid, pass);
    int connectionTimeout = 0;
    while (WiFi.status() != WL_CONNECTED) {
        // When we reach timeout reset the ESP and try to get credentials again
        if (connectionTimeout == CONN_TIMEOUT) {
            UIHandler::getInstance()->clear();
            UIHandler::getInstance()->writeLine("Connection timeout!", 1);
            UIHandler::getInstance()->writeLine("(1 minute)", 1, 4);
            UIHandler::getInstance()->makeScrollingText("The device will forget the given network and restart...", 3);
            return 0;
        }
        delay(2000);
        connectionTimeout++;
    }
    // If connection is ok let's check the connection
    if (systemID == 0) { // If we have no system ID than get one
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
                return newSystemID;
            } else {
                Serial.print("HTTP error code: ");
                Serial.println(String(httpCode));
                return 0;
            }
        } else {
            Serial.println("Connection check failed!");
            return 0;
        }
    }
    httpClient.end();
    // If we alrady have an id
    return systemID;
}

void ServerConnector::disconnect() { WiFi.disconnect(); }