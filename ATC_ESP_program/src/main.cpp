#include "ActuatorHandler.h"
#include "ConfigHandler.h"
#include "MemoryHandler.h"
#include "SensorHandler.h"
#include "ServerConnector.h"
#include "deviceInit.h"
#include <Arduino.h>
#include <chrono>

using namespace std::chrono;

#define UPDATE_INTERVAL_MIN 30

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;
ConfigHandler* g_configHandler;
SensorHandler* g_sensorHandler;
bool gb_statusCheckFlag = true;
uint8_t g_lastMinute = 0;

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
    auto start = high_resolution_clock::now();
    int h = hour();
    int min = minute();
    int sec = second();
    const uint16_t minutesSinceMidnight = h * 60 + min;
    if (h == 0 && min == 0 && sec < 10 && sec > 0) { // At midnight sync time (10 sec interval)
        g_server->syncNTPTime();
        // We can reset last minute storage here
        g_lastMinute = 0;
    }
    // Config updating with interval
    if (min % UPDATE_INTERVAL_MIN == 0) {
        updateConfig();
    }
    // Make sure status check is only performed once every minute
    if (g_lastMinute < minutesSinceMidnight) {
        g_lastMinute = minutesSinceMidnight;
        gb_statusCheckFlag = true;
    }

    // Status checking and acting
    if (gb_statusCheckFlag) {
        ConfigStatus actualStatus = g_configHandler->checkFullfillmentStatus(g_sensorHandler->getLastSamples());
        switch (actualStatus) {
            // TODO: decide what to do...
        }
        gb_statusCheckFlag = false;
    }

    UIHandler::writeBasicInfo(
        g_sensorHandler->getLastSamples()->getPh(), g_sensorHandler->getLastSamples()->getTemperature());
    auto stop = high_resolution_clock::now();
    auto runtime = duration_cast<milliseconds>(stop - start);
    Serial.print("Runtime of currently ran loop is: [ms]");
    Serial.println(runtime.count());
    delay(5000);
}