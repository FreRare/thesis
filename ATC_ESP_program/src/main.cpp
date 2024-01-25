#include "ActuatorHandler.h"
#include "ConfigHandler.h"
#include "MemoryHandler.h"
#include "SensorHandler.h"
#include "ServerConnector.h"
#include "deviceInit.h"
#include <Arduino.h>
#include <chrono>

using namespace std::chrono;

#define UPDATE_INTERVAL_MIN 10U

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;
ConfigHandler* g_configHandler;
SensorHandler* g_sensorHandler;
bool gb_statusCheckFlag = true;
bool gb_screenUpdateFlag = true;
uint16_t g_statusCheckLastMinute = 0U;

void updateConfig()
{
    // Update config from DB
    ConfigData* currentConfig = g_configHandler->getConfiguration();
    ConfigData* config = g_server->updateConfigData();
    if (config == nullptr) {
        Serial.println("Downloaded config is NULL!");
        return;
    } else {
        config->print();
    }
    // If we have no saved config or there was update save the updated config
    if (currentConfig == nullptr || !currentConfig->equals(config)) {
        Serial.println("Updating config in memory...");
        g_configHandler->saveConfigData(config);
    }
}

/**
 * @brief This function reads all the sensors and sends the measured data to the server
 * @see SensorHandler - to read the data
 * @see ServerConnector - to post it to the server
 * @return true - if the sending was successful
 * @return false - if the sending encountered some problems (network issues mostly)
 */
bool takeSensorSample()
{
    g_sensorHandler->readSensors();
    const SensorData* sample = g_sensorHandler->getLastSamples();
    return g_server->postSensorData(sample);
}

/**
 * @brief Decides what to do based on the config status
 * Calls the ActuatorHandler's checkFullfillmentStatus function and decides what actions to take based on the status.
 * This function is only called once every minute, so timings can be delayed by minutes, if they're timed to the same
 * minute
 */
void statusHandler()
{
    SensorData* lastSamples = g_sensorHandler->getLastSamples();
    std::vector<ConfigStatus> actualStatuses = g_configHandler->checkFullfillmentStatus(lastSamples);
    char* log = new char[256];
    sprintf(log, "System status: %d", actualStatus);
    g_server->ATCLog(log);
    delete log;
    for (size_t i = 0; i < actualStatuses.size(); i++) {
        Serial.print("Handling status code: ");
        Serial.println(actualStatuses[i]);
        switch (actualStatuses[i]) {
        case ConfigStatus::LOW_TEMP: // TODO: send notification
            break;
        case ConfigStatus::HIGH_TEMP: // TODO: send notification
            break;
        case ConfigStatus::LOW_PH: // TODO: send notification
            break;
        case ConfigStatus::HIGH_PH: // TODO: send notification
            break;
        case ConfigStatus::LOW_WATER: // TODO: send notification
            break;
        case ConfigStatus::OUTLET_1_ON:
            g_actuatorHandler->channelSwithcer(1, true);
            break;
        case ConfigStatus::OUTLET_1_OFF:
            g_actuatorHandler->channelSwithcer(1, false);
            break;
        case ConfigStatus::OUTLET_2_ON:
            g_actuatorHandler->channelSwithcer(2, true);
            break;
        case ConfigStatus::OUTLET_2_OFF:
            g_actuatorHandler->channelSwithcer(2, false);
            break;
        case ConfigStatus::OUTLET_3_ON:
            g_actuatorHandler->channelSwithcer(3, true);
            break;
        case ConfigStatus::OUTLET_3_OFF:
            g_actuatorHandler->channelSwithcer(3, false);
            break;
        case ConfigStatus::SAMPLE_TIME:
            if (!takeSensorSample()) {
                // TODO: send error
            }
            break;
        case ConfigStatus::FEEDING_TIME:
            g_actuatorHandler->feed(g_configHandler->getConfiguration()->getFeedingPortions());
            break;
        case ConfigStatus::BROKEN_LIGHT: // TODO: send notification
            break;
        case ConfigStatus::ERROR: // TODO: send error
            break;
        case ConfigStatus::OK_STATUS:
            break;
        default:
            break;
        }
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
    const uint16_t minutesSinceMidnight = h * 60 + min;
    if (h == 0 && min == 0 && sec < 5 && sec > 0) { // At midnight sync time (10 sec interval)
        g_server->syncNTPTime();
        // We can reset last minute storage here
        g_statusCheckLastMinute = 0;
    }
    // Config updating with interval
    if (min % UPDATE_INTERVAL_MIN == 0 && sec < 5) {
        updateConfig();
    }
    // Make sure status check is only performed once every minute
    if (g_statusCheckLastMinute < minutesSinceMidnight) {
        g_statusCheckLastMinute = minutesSinceMidnight;
        gb_statusCheckFlag = true;
        gb_screenUpdateFlag = true;
    }

    // Status checking and acting
    if (gb_statusCheckFlag) {
        Serial.print("StatusHandler call at: ");
        Serial.print(h);
        Serial.print(":");
        Serial.print(min);
        Serial.print(":");
        Serial.println(sec);
        statusHandler();
        gb_statusCheckFlag = false; // Lets see what happens if we call this more than once a minute
    }
    if (gb_screenUpdateFlag) {
        if (g_sensorHandler->getLastSamples() != nullptr) {
            UIHandler::writeBasicInfo(
                g_sensorHandler->getLastSamples()->getPh(), g_sensorHandler->getLastSamples()->getTemperature());
        } else {
            UIHandler::writeBasicInfo(0.0F, 0.0F);
        }
        gb_screenUpdateFlag = false;
    }
}