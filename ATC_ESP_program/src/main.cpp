#include "ActuatorHandler.h"
#include "ConfigHandler.h"
#include "MemoryHandler.h"
#include "SensorHandler.h"
#include "ServerConnector.h"
#include "deviceInit.h"
#include <Arduino.h>

#define CONFIG_UPDATE_INTERVAL_MIN 30

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;
ConfigHandler* g_configHandler;
SensorHandler* g_sensorHandler;

void updateConfig()
{
    // Update config from DB
    ConfigData* currentConfig = g_configHandler->getConfiguration();
    ConfigData* config = g_server->updateConfigData();
    if (config != nullptr) {
        Serial.println("Config downloaded!");
        config->print();
    }
    // If we have no saved config or there was update save the updated config
    if (currentConfig == nullptr || !currentConfig->equals(config)) {
        Serial.println("Updating config in memory...");
        g_configHandler->saveConfigData(config);
    }
}

void setup()
{
    Serial.begin(115200);
    while (!Serial)
        ;
    //! MemoryHandler::getInstance()->clearMemory(0, 512);

    // Pin configurations
    pinSetup();
    // Global var initializations
    g_server = new ServerConnector();
    g_actuatorHandler = new ActuatorHandler();
    g_configHandler = new ConfigHandler();
    g_sensorHandler = new SensorHandler();
    updateConfig();
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
    // Config updating with interval
    if (min % CONFIG_UPDATE_INTERVAL_MIN == 0) {
        updateConfig();
    }

    // Light timing -> should be in ActuatorHandler
    if (h >= 8 && h <= 20) {
        g_actuatorHandler->channelSwithcer(1, true);
    } else if ((h < 8 || h > 20)) {
        g_actuatorHandler->channelSwithcer(1, false);
    }

    Serial.println("Reading sensors...");
    g_sensorHandler->readSensors();
    SensorData* sample = g_sensorHandler->getLastSamples();
    char* sampleString = sample->toCharArray();
    Serial.print("Sensor samples: ");
    Serial.println(sampleString);

    delay(5000);
}