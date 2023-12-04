#include "SensorData.h"

SensorData::SensorData(
    const float& temp, const float& ph, const LightIntensity& light, const uint8_t& waterLvl, const time_t& time)
    : temperature(temp)
    , ph(ph)
    , lightAmount(light)
    , waterLvl(waterLvl)
    , timeStamp(time)
{
}

float SensorData::GetTemperature() const { return temperature; }

void SensorData::SetTemperature(float temperature) { temperature = temperature; }

LightIntensity SensorData::GetLightAmount() const { return lightAmount; }

void SensorData::SetLightAmount(LightIntensity lightAmount) { lightAmount = lightAmount; }

uint8_t SensorData::GetWaterLvl() const { return waterLvl; }

void SensorData::SetWaterLvl(uint8_t waterLvl) { waterLvl = waterLvl; }

float SensorData::GetPh() const { return ph; }

void SensorData::SetPh(float ph) { ph = ph; }

time_t SensorData::GetTimeStamp() const { return timeStamp; }

void SensorData::SetTimeStamp(time_t timeStamp) { timeStamp = timeStamp; }

char* SensorData::toCharArray()
{
    char* dataCharArray[CHAR_ARRAY_LENGTH] = {};
    sprintf(*dataCharArray, "%.2f::%.2f::%d::%d::%lld", this->temperature, this->ph, this->lightAmount, this->waterLvl,
        this->timeStamp);
    return *dataCharArray;
}