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
    ConfigData* getConfiguration() { return this->configuration; }
    /**
     * Loads the configuration data from the EEPROM
     */
    void loadConfigDataFromMemory();
    /**
     * Writes the given config data to the EEPROM
     */
    void saveConfigData(ConfigData* data);
    /**
     * Check which of the ConfigStatus enum's value is assignable to the current state of the system (sensors)
     * @warning This function should be executed maximum once every minute bc all timings are minute accurate!
     */
    ConfigStatus checkFullfillmentStatus(const SensorData* data);
};

#endif