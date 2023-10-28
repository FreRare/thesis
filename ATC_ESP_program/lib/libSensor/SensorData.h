#ifndef SensorData_h
#define SensorData_h
#include <LightIntensity.h>
#include <time.h>

///////////////////////////////////////////////////////////////////
// This class is the schema for storing the data from the sensors
/////////////////////////////////////////////////////////////////

class SensorData {
private:
    uint16_t temperature;
    LightIntensity lightAmount;
    uint16_t waterLvl;
    float ph;
    time_t timeStamp;

public:
    SensorData(const uint16_t& temp, const LightIntensity& light, const uint16_t& waterLvl, const float& ph,
        const time_t& time);

    uint16_t GetTemperature() const { return temperature; }

    void SetTemperature(uint16_t temperature) { temperature = temperature; }

    LightIntensity GetLightAmount() const { return lightAmount; }

    void SetLightAmount(LightIntensity lightAmount) { lightAmount = lightAmount; }

    uint16_t GetWaterLvl() const { return waterLvl; }

    void SetWaterLvl(uint16_t waterLvl) { waterLvl = waterLvl; }

    float GetPh() const { return ph; }

    void SetPh(float ph) { ph = ph; }

    time_t GetTimeStamp() const { return timeStamp; }

    void SetTimeStamp(time_t timeStamp) { timeStamp = timeStamp; }
};

#endif