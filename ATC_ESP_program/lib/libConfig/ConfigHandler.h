#ifndef ConfigHanler_h
#define ConfigHanlder_h
#include "../libEnums/ConfigStatus.h"
#include "../libSensor/SensorData.h"
#include "ConfigData.h"
#include "MemoryHandler.h"
#include <TimeLib.h>

/**
 * This class is handling the configurations and it's staisfactory
 */
class ConfigHandler {
private:
    ConfigData* configuration;
    static MemoryHandler* memHandler;

public:
    ConfigHandler();
    ~ConfigHandler();
    /**
     * Loads the configuration data from the EEPROM
     */
    ConfigData loadConfigDataFromMemory();
    /**
     * Writes the given config data to the EEPROM
     */
    void saveConfigData(const ConfigData& data);
    /**
     * Check which of the ConfigStatus enum's value is assignable to the current state of the system (sensors)
     */
    ConfigStatus checkFullfillmentStatus(const SensorData& data, const time_t& timeNow);
};

#endif