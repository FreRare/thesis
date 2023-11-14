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
    ConfigData configuration;
    static MemoryHandler* memHandler;
    /*
        * This is how to retrieve data from incoming json data
        ConfigData* freshConfig = new ConfigData(configDoc["minTemp"], configDoc["maxTemp"], configDoc["minPh"],
                    configDoc["maxPh"], configDoc["ol1On"], configDoc["ol1Off"], configDoc["ol2On"],
                    configDoc["ol2Off"], configDoc["ol3On"], configDoc["ol3Off"], configDoc["waterLvlAlert"],
                    configDoc["feedingTime"], configDoc["foodPortions"], configDoc["samplePeriod"]);
    */

public:
    ConfigHandler();
    ConfigData loadConfigDataFromMemory();
    void saveConfigData(const ConfigData& data);
    ConfigStatus checkFullfillmentStatus(const SensorData& data, const time_t& timeNow);
};

#endif