#include "SensorData.h"

SensorData::SensorData(
    const float& temp, const float& ph, const LightIntensity& light, const bool& waterLvl, const time_t& time)
    : temperature(temp)
    , ph(ph)
    , lightAmount(light)
    , waterLvl(waterLvl)
    , timeStamp(time)
{
}

float SensorData::getTemperature() const { return temperature; }

void SensorData::setTemperature(float temperature) { temperature = temperature; }

LightIntensity SensorData::getLightAmount() const { return lightAmount; }

void SensorData::setLightAmount(LightIntensity lightAmount) { lightAmount = lightAmount; }

bool SensorData::getWaterLvl() const { return waterLvl; }

void SensorData::setWaterLvl(bool waterLvl) { waterLvl = waterLvl; }

float SensorData::getPh() const { return ph; }

void SensorData::setPh(float ph) { ph = ph; }

time_t SensorData::getTimeStamp() const { return timeStamp; }

void SensorData::setTimeStamp(time_t timeStamp) { timeStamp = timeStamp; }