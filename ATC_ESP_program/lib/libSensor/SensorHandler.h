#ifndef SensorHandler_h
#define SensorHandler_h
#include "SensorData.h"

///////////////////////////////////////////////////////////////
// The class for handling sensors and the data coming from them
////////////////////////////////////////////////////////////////

class SensorHandler {
private:
    std::vector<SensorData> dailyData;
    uint16_t readTempSensor(); // get functions will call the read functions
    uint16_t readLightSensor();
    uint16_t readWaterSensor();
    uint16_t readPhSensor();
    uint16_t getTempData();
    LightIntensity getLightData();
    uint16_t getWaterData();
    float getPhData();
    SensorData readSensors();

public:
    SensorHandler();
    void saveSensorDataToDB();
    std::vector<SensorData> getDailyData();
    SensorData getNthSample(const uint16_t& n);
};

#endif