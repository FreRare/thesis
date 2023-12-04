#ifndef SensorData_h
#define SensorData_h
#include <LightIntensity.h>
#include <stdio.h>
#include <time.h>

// The length of the char array to represent the data as string with the :: separator
// 4(temp) + 4(ph) + 1(light) + 3(waterlvl) + 10(timestamp, unix) + 4*2(:: separator) + 6(additional for decimal points
// worst case etc.)
#define CHAR_ARRAY_LENGTH 36

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

    float GetTemperature() const;

    void SetTemperature(float temperature);

    LightIntensity GetLightAmount() const;

    void SetLightAmount(LightIntensity lightAmount);

    uint8_t GetWaterLvl() const;

    void SetWaterLvl(uint8_t waterLvl);

    float GetPh() const;

    void SetPh(float ph);

    time_t GetTimeStamp() const;

    void SetTimeStamp(time_t timeStamp);

    /**
     * @public
     * Creates a char array of the object's data separated by '::'
     * @returns - The char array as mentioned
     */
    char* toCharArray();
};

#endif