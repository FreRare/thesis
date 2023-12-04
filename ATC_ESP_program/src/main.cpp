#include "ActuatorHandler.h"
#include "ConfigHandler.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include "deviceInit.h"
#include <Arduino.h>
#include <stdio.h>

#define CONFIG_UPDATE_INTERVAL_MIN 30

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;
ConfigHandler* g_configHandler;

void coorigateDigits(int h, int min, char str[6])
{
    if (h > 9 && min > 9) {
        sprintf(str, "%2d:%2d", h, min);
    } else if (h > 9) {
        sprintf(str, "%2d:0%1d", h, min);
    } else if (min > 9) {
        sprintf(str, "0%1d:%2d", h, min);
    } else {
        sprintf(str, "0%1d:0%1d", h, min);
    }
}

void setup()
{
    Serial.begin(9600);
    while (!Serial)
        ;
    //! MemoryHandler::getInstance()->clearMemory(0, 512);

    // Pin configurations
    pinSetup();
    // Global var initializations
    g_server = new ServerConnector();
    g_actuatorHandler = new ActuatorHandler();
    g_configHandler = new ConfigHandler();
    // Update config from DB
    ConfigData* currentConfig = g_configHandler->getConfiguration();
    ConfigData* config = g_server->updateConfigData();
    // If we have no saved config or there was update save the updated config
    if (currentConfig == nullptr || !currentConfig->equals(config)) {
        g_configHandler->saveConfigData(config);
    }

    // Clean up LCD
    UIHandler::getInstance()->clear();
}

void loop()
{
    int h = hour();
    int min = minute();
    int sec = second();
    if (h == 0 && min == 0 && sec < 10 && sec > 0) { // At midnight sync time (10 sec interval)
        g_server->syncNTPTime();
    }
    // Display clock data
    char clockStr[6];
    coorigateDigits(h, min, clockStr);
    UIHandler::getInstance()->writeLine("Clock: ", 1);
    UIHandler::getInstance()->writeLine(clockStr, 2, 3);

    // Light timing -> should be in ActuatorHandler
    if (h >= 8 && h <= 20) {
        g_actuatorHandler->turnOnChannel1();
    } else if ((h < 8 || h > 20)) {
        g_actuatorHandler->turnOffChannel1();
    }
    // Config updating with interval
    if (min % CONFIG_UPDATE_INTERVAL_MIN == 0) {
        ConfigData* currentConfig = g_configHandler->getConfiguration();
        ConfigData* config = g_server->updateConfigData();
        // If we have no saved config or there was update save the updated config
        if (currentConfig == nullptr || !currentConfig->equals(config)) {
            g_configHandler->saveConfigData(config);
        }
    }

    delay(5000);
}