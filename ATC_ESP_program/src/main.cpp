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
#define UPDATE_INTERVAL_MIN 10U // Configuration update interval in minutes
// Longest loop runtime measure is 71954ms so far...
#define WDT_TIMEOUT_MS 80000U //! Should be longer than sensor sampling cycle

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;
ConfigHandler* g_configHandler;
SensorHandler* g_sensorHandler;
bool gb_minuteIntervalFlag = true; // Flag to indicate a minute has passed
uint16_t g_statusCheckLastMinute = 0U; // Stores the last minute status has been checked
uint32_t g_startTimeMs = 0U; // To measure runtime
uint16_t g_h = 0U;
uint16_t g_min = 0U;
uint16_t g_sec = 0U;
uint16_t g_minutesSinceMidnight = 0U;
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
        Serial.println("========================");
        if (actualStatuses[i] != OK_STATUS) {
            char log[29];
            sprintf(log, "Handling system status: %3d", actualStatuses[i]);
            log[28] = '\0';
            g_server->ATCLog(log);
        }
        switch (actualStatuses[i]) {
        case ConfigStatus::LOW_TEMP:
            g_server->postErrorCode(ConfigStatus::LOW_TEMP);
            break;
        case ConfigStatus::HIGH_TEMP:
            g_server->postErrorCode(ConfigStatus::HIGH_TEMP);
            break;
        case ConfigStatus::LOW_PH:
            g_server->postErrorCode(ConfigStatus::LOW_PH);
            break;
        case ConfigStatus::HIGH_PH:
            g_server->postErrorCode(ConfigStatus::HIGH_PH);
            break;
        case ConfigStatus::LOW_WATER: 
            g_server->postErrorCode(ConfigStatus::LOW_WATER);
            break;
        case ConfigStatus::OUTLET_1_ON:
            g_actuatorHandler->channelStates[0] = true;
            digitalWrite(SHIFT_REGISTER_DATA_PIN, HIGH);
            break;
            g_actuatorHandler->channelSwithcer(1, true);
            break;
        case ConfigStatus::OUTLET_1_OFF:
            g_actuatorHandler->channelStates[0] = false;
            digitalWrite(SHIFT_REGISTER_DATA_PIN, LOW);
            break;
            g_actuatorHandler->channelSwithcer(1, false);
            break;
        case ConfigStatus::OUTLET_2_ON:
            break;
            g_actuatorHandler->channelSwithcer(2, true);
            break;
        case ConfigStatus::OUTLET_2_OFF:
            break;
            g_actuatorHandler->channelSwithcer(2, false);
            break;
        case ConfigStatus::OUTLET_3_ON:
            break;
            g_actuatorHandler->channelSwithcer(3, true);
            break;
        case ConfigStatus::OUTLET_3_OFF:
            break;
            g_actuatorHandler->channelSwithcer(3, false);
            break;
        case ConfigStatus::SAMPLE_TIME:
            if (!takeSensorSample()) {
                g_server->postErrorCode(ConfigStatus::SAMPLE_TIME);
            }
            break;
        case ConfigStatus::FEEDING_TIME:
            break;
            g_actuatorHandler->feed(g_configHandler->getConfiguration()->getFeedingPortions());
            break;
        case ConfigStatus::BROKEN_LIGHT:
            g_server->postErrorCode(ConfigStatus::BROKEN_LIGHT);
            break;
        case ConfigStatus::ERROR: 
            g_server->postErrorCode(ConfigStatus::ERROR);
            break;
        case ConfigStatus::OK_STATUS:
            break;
        default:
            break;
        }
    }
    // updateShiftRegister(g_actuatorHandler->shiftRegisterState);
    Serial.println("Leaving statushandler..");
}

/**
 * @brief Logs the previous reset cause to the server
 */
void resetLogger()
{
    struct rst_info* reset_info = ESP.getResetInfoPtr();
    char rstLog[64];
    // Log reset cause
  switch (reset_info->reason) {
    case REASON_DEFAULT_RST:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "Normal reboot");
      break;
    case REASON_WDT_RST:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "Watchdog reset");
      break;
    case REASON_EXCEPTION_RST:
      sprintf(rstLog, "!!!!!! EXCEPTION reset cause => %d", reset_info->exccause);
      break;
    case REASON_SOFT_WDT_RST:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "Software watchdog reset");
      break;
    case REASON_SOFT_RESTART:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "Software restart");
      break;
    case REASON_DEEP_SLEEP_AWAKE:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "Deep sleep wakeup");
      break;
    case REASON_EXT_SYS_RST:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "External system reset");
      break;
    default:
      sprintf(rstLog, "!!!!!! Reset cause => %s", "Unknown reset cause");
      break;
  }
    rstLog[63] = '\0';
    g_server->ATCLog(rstLog);
}

/**
 * @brief Performs a basic factory reset by cleaning all memory and setting the chip to idle state until reboot
 */
void performFactoryReset(){
    g_server->disconnect();
    MemoryHandler::getInstance()->clearMemory(0);
    UIHandler::getInstance()->clear();
    UIHandler::getInstance()->writeLine("Factory reset was", 1);
    UIHandler::getInstance()->writeLine("successful!", 1, 5);
    UIHandler::getInstance()->writeLine("All memory cleared", 3);
    UIHandler::getInstance()->writeLine("Waiting for reboot..", 4);
}

/*-----------------------------------
Functions END
------------------------------------*/

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
    g_sensorHandler = new SensorHandler();
    updateConfig();
    Serial.println("Config updated!");
    resetLogger();
    // Clean up LCD
    UIHandler::getInstance()->clear();
    // Watchdog timer
    ESP.wdtEnable(WDT_TIMEOUT_MS);
}

void loop()
{
    /*---------------------
    Time variables and sync START
    ----------------------*/
    g_startTimeMs = millis(); // To measure runtime
    g_h = hour();
    g_min = minute();
    g_sec = second();
    g_minutesSinceMidnight = g_h * 60 + g_min;
    if (g_h == 0 && g_min == 0 && g_sec < 5 && g_sec > 0) { // At midnight sync time (5 sec interval)
        g_server->syncNTPTime();
        // We can reset last minute storage here
        g_statusCheckLastMinute = 0;
        // Reset notification flags
        g_server->resetNotificationFlags();
    }
    // Make sure status check is only performed once every minute
    if (g_statusCheckLastMinute < g_minutesSinceMidnight) {
        g_statusCheckLastMinute = g_minutesSinceMidnight;
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
        if (g_min % UPDATE_INTERVAL_MIN == 0) {
            if(server->checkForFactoryReset()){
                performFactoryReset();
            }
            updateConfig();
        }
        Serial.print("StatusHandler call at: ");
        Serial.print(g_h);
        Serial.print(":");
        Serial.print(g_min);
        Serial.print(":");
        Serial.println(g_sec);
        Serial.println("========================");
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
        Serial.println("******************");
        Serial.print("Free heap available: ");
        Serial.println(ESP.getFreeHeap());
        Serial.print("Free stack available: ");
        Serial.println(ESP.getFreeContStack());
        Serial.print("Current action loop runtime was [ms]: ");
        Serial.println(millis() - g_startTimeMs);
        Serial.println("******************");

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