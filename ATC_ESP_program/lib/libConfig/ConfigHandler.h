#ifndef ConfigHanler_h
#define ConfigHanlder_h
#include "../libEnums/ConfigStatus.h"
#include "../libSensor/SensorData.h"
#include <ConfigData.h>
#include <MemoryHandler.h>
#include <time.h>

////////////////////////////////////////////////////////////////////
// This class is handling the configurations and it's staisfactory
///////////////////////////////////////////////////////////////////

class ConfigHandler {
private:
    ConfigData configuration;
    static MemoryHandler* memHanlder;

public:
    ConfigHandler();
    ConfigData readConfigData();
    void SaveConfigData(const ConfigData& data);
    uint8_t checkFullfillmentStatus(const SensorData& data, const time_t& timeNow);
};

#endif