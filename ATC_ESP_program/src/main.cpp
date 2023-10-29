#include "AQWiFiConfig.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>

void setup()
{
    Serial.begin(9600);
    AQWiFiConfig* config = new AQWiFiConfig(); // Config automatically performs the WiFi config
    ServerConnector* server = new ServerConnector();
    uint16_t systemID = server->connectToNetwork(config->getSSID(), config->getPassword(), config->getSystemID());
    if (systemID == 0) { // If connection failed
        config->forgetNetwork();
        ESP.restart();
    } else if (config->getSystemID() == 0) { // We got a valid ID and we didn't have one save it
        config->saveSystemID(systemID);
    }
    // Give feedback on success
    UIHandler::getInstance()->clear();
    UIHandler::getInstance()->writeLine("Successful", 1);
    UIHandler::getInstance()->writeLine("      connection!", 2);
    UIHandler::getInstance()->writeLine("Your system ID:" + String(systemID), 3);
    UIHandler::getInstance()->makeScrollingText("Use this ID for registration inside the app!", 4, 300, 2);
}

void loop() { }