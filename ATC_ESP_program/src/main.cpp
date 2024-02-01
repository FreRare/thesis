#include "ActuatorHandler.h"
#include "ConfigHandler.h"
#include "Debug.h"
#include "MemoryHandler.h"
#include "SensorHandler.h"
#include "ServerConnector.h"
#include "deviceInit.h"
#include <Arduino.h>

/*---------------------------------
Main defines and global vars START
------------------------------------*/
// Debug option, uses Serial.print to log info set to 0 if no debugging is required //! not working
#define DEBUG 1
#define UPDATE_INTERVAL_MIN 15U // Configuration update interval in minutes
// Longest loop runtime measure is 10152ms so far...
#define WDT_TIMEOUT_MS 12000U

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;
ConfigHandler* g_configHandler;
SensorHandler* g_sensorHandler;
bool gb_minuteIntervalFlag = true; // Flag to indicate a minute has passed
uint16_t g_statusCheckLastMinute = 0U; // Stores the last minute status has been checked
/*---------------------------------
Main defines and global vars END
------------------------------------*/

/*-----------------------------------
Functions START
------------------------------------*/

/**
 * @brief Updates the configuration form the server
 * Downloads the newest config form the server and saves it to the memory after comparison to the actual config
 */
void updateConfig()
{
    Serial.print("Free stack before config update start: ");
    Serial.println(ESP.getFreeContStack());
    // Update config from DB
    ConfigData* currentConfig = g_configHandler->getConfiguration();
    ConfigData* config = new ConfigData();
    Serial.print("Free stack before config update from server: ");
    Serial.println(ESP.getFreeContStack());
    config = g_server->updateConfigData(config);
    Serial.print("Free stack after config update: ");
    Serial.println(ESP.getFreeContStack());
    if (config == nullptr) {
        Serial.println("Downloaded config is NULL!");
        return;
    } else {
        Serial.println(config->print());
    }
    // If we have no saved config or there was update save the updated config
    if (currentConfig == nullptr || !currentConfig->equals(config)) {
        Serial.println("Updating config in memory...");
        g_configHandler->saveConfigData(config);
    }
    delete config;
    Serial.print("Free stack after config update in memory: ");
    Serial.println(ESP.getFreeContStack());
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
    for (size_t i = 0; i < actualStatuses.size(); i++) {
        Serial.print("Handling status code: ");
        Serial.println(actualStatuses[i]);
        char* log = new char[27];
        sprintf(log, "Handling system status: %1d", actualStatuses[i]);
        log[26] = '\0';
        g_server->ATCLog(log);
        delete[] log;
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
    updateShiftRegister(g_actuatorHandler->shiftRegisterState);
}

void resetLogger()
{
    rst_info* resetInfo = ESP.getResetInfoPtr();
    if (resetInfo->reason == REASON_EXCEPTION_RST) {
        char rstLog[90];
        sprintf(rstLog, "!!!!!! Exception reset cause => %d :: Stack space: %d, Heap space: %d", resetInfo->exccause,
            ESP.getFreeContStack(), ESP.getFreeHeap());
        rstLog[89] = '\0';
        g_server->ATCLog(rstLog);
    }
}

/*-----------------------------------
Functions END
------------------------------------*/

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
    Serial.println("Config updated!");
    resetLogger();
    // Clean up LCD
    UIHandler::getInstance()->clear();
    // Watchdog timer
    ESP.wdtDisable();
    ESP.wdtEnable(WDT_TIMEOUT_MS);
}

void loop()
{
    /*---------------------
    Time variables and sync START
    ----------------------*/
    uint32_t startTimeMs = millis(); // To measure runtime
    uint16_t h = hour();
    uint16_t min = minute();
    uint16_t sec = second();
    const uint16_t minutesSinceMidnight = h * 60 + min;
    if (h == 0 && min == 0 && sec < 5 && sec > 0) { // At midnight sync time (5 sec interval)
        g_server->syncNTPTime();
        // We can reset last minute storage here
        g_statusCheckLastMinute = 0;
    }
    // Make sure status check is only performed once every minute
    if (g_statusCheckLastMinute < minutesSinceMidnight) {
        g_statusCheckLastMinute = minutesSinceMidnight;
        gb_minuteIntervalFlag = true;
    }
    /*---------------------
    Time variables and sync END
    ----------------------*/

    /*---------------------
    Status check and handling
    Put all actions inside if to be called once every minute
    ----------------------*/
    if (gb_minuteIntervalFlag) {
        gb_minuteIntervalFlag = false;
        // Config updating with interval
        if (min % UPDATE_INTERVAL_MIN == 0) {
            updateConfig();
        }
        Serial.print("StatusHandler call at: ");
        Serial.print(h);
        Serial.print(":");
        Serial.print(min);
        Serial.print(":");
        Serial.println(sec);
        statusHandler(); //* Statushandler call
        delay(500);
        // Screen info update every minute after all actions
        if (g_sensorHandler->getLastSamples() != nullptr) {
            UIHandler::writeBasicInfo(
                g_sensorHandler->getLastSamples()->getPh(), g_sensorHandler->getLastSamples()->getTemperature());
        } else {
            UIHandler::writeBasicInfo(0.0F, 0.0F);
        }
        /*--------------------------------
        Memory log and managment START
        ---------------------------------*/
        Serial.print("Free heap available: ");
        Serial.println(ESP.getFreeHeap());
        Serial.print("Free stack available: ");
        Serial.println(ESP.getFreeContStack());
        Serial.print("Current action loop runtime was [ms]: ");
        Serial.println(millis() - startTimeMs);

        // If running low on stack or heap reset the MCU and send log
        char memoryLog[52];
        if (ESP.getFreeContStack() < 300) {
            sprintf(memoryLog, "!!!!!! STACK memory is running low RESETTING !!!!!!");
            memoryLog[51] = '\0';
            g_server->ATCLog(memoryLog);
            ESP.restart();
        }
        if (ESP.getFreeHeap() < 1000) {
            sprintf(memoryLog, "!!!!!! HEAP memory is running low RESETTING !!!!!!!");
            memoryLog[51] = '\0';
            g_server->ATCLog(memoryLog);
            ESP.restart();
        }
        /*--------------------------------
        Memory log and managment END
        ---------------------------------*/
    }
    ESP.wdtFeed();
}