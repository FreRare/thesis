#ifndef SensorData_h
#define SensorData_h
#include <LightIntensity.h>
#include <time.h>

///////////////////////////////////////////////////////////////////
// This class is the schema for storing the data from the sensors
/////////////////////////////////////////////////////////////////

class SensorData {
private:
    float temperature;
<<<<<<< HEAD
    LightIntensity lightAmount;
    uint16_t waterLvl;
=======
>>>>>>> main
    float ph;
    LightIntensity lightAmount;
    uint8_t waterLvl;
    time_t timeStamp;

public:
    SensorData(
        const float& temp, const float& ph, const LightIntensity& light, const uint8_t& waterLvl, const time_t& time);

    float GetTemperature() const { return temperature; }

    void SetTemperature(float temperature) { temperature = temperature; }

    LightIntensity GetLightAmount() const { return lightAmount; }

    void SetLightAmount(LightIntensity lightAmount) { lightAmount = lightAmount; }

    uint8_t GetWaterLvl() const { return waterLvl; }

    void SetWaterLvl(uint8_t waterLvl) { waterLvl = waterLvl; }

    float GetPh() const { return ph; }

    void SetPh(float ph) { ph = ph; }

    time_t GetTimeStamp() const { return timeStamp; }

    void SetTimeStamp(time_t timeStamp) { timeStamp = timeStamp; }
};

#endif