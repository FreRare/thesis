#ifndef ConfigHanler_h
#define ConfigHanlder_h
#include "SensorData.h"
#include "time.h"
#include <ConfigData.h>
#include <ConfigStatus.h>
#include <MemoryHandler.h>

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