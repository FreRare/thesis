#ifndef SensorData_h
#define SensorData_h
#include <LightIntensity.h>
#include <stdio.h>
#include <time.h>

// The length of the char array to represent the data as string with the :: separator
// 4(temp) + 4(ph) + 1(light) + 3(waterlvl) + 10(timestamp, unix) + 4*2(:: separator) + 6(additional for decimal points
// worst case etc.)
#define CHAR_ARRAY_LENGTH 36U

/**
 * Represents a set of data retrieved from different sensors
 */
class SensorData {
private:
    float temperature;
    float ph;
    LightIntensity lightAmount;
    uint8_t waterLvl;
    time_t timeStamp;

public:
    SensorData(
        const float& temp, const float& ph, const LightIntensity& light, const uint8_t& waterLvl, const time_t& time);

    float getTemperature() const;

    void setTemperature(float temperature);

    LightIntensity getLightAmount() const;

    void setLightAmount(LightIntensity lightAmount);

    uint8_t getWaterLvl() const;

    void setWaterLvl(uint8_t waterLvl);

    float getPh() const;

    void setPh(float ph);

    time_t getTimeStamp() const;

    void setTimeStamp(time_t timeStamp);
};

#endif