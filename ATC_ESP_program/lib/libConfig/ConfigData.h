#ifndef ConfigData_h
#define ConfigData_h
#include <CleanPeriod.h>
#include <LightIntensity.h>
#include <SamplePeriod.h>
#include <ctype.h>

#define MAX_TIMING_VAL 1440 // the maximum value the timings can have (24*60)
// 1 is 0:01 and 1440 is 0:00, 0 means no timing -> this is handled in the confighandler

#define MIN_PH 0.0F
#define MAX_PH 14.0F

///////////////////////////////////////////////////////////////
// This class represents the configuration of the whole system
// All timings periods and values are stored in this schema
///////////////////////////////////////////////////////////////

class ConfigData {
private:
    uint16_t minTemp;
    uint16_t maxTemp;
    uint16_t waterLvlAlert;
    float minPh;
    float maxPh;
    CleanPeriod filterChangePeriod;
    CleanPeriod waterChangePeriod;
    uint16_t lightOnTime; // Timings are storing the value of
    uint16_t lightOffTime; // minutes past mindnight that day
    uint16_t filterOnTime;
    uint16_t filterOffTime;
    uint16_t airOnTime;
    uint16_t airOffTime;
    uint16_t feedingTime;
    SamplePeriod samplePeriod;
    uint8_t feedingPortions; // According to this data length is 20 + 5 + 8 = 33 byte

public:
    ConfigData(const uint16_t& minTemp, const uint16_t& maxTemp, const uint16_t& waterLvlAlert,
        const uint16_t& lightOnTime, const uint16_t& lightOffTime, const uint16_t& filterOnTime,
        const uint16_t& filterOffTime, const uint16_t& airOnTime, const uint16_t& airOffTime,
        const uint16_t& feedingTime, const float& minPh, const float& maxPh, const uint8_t& feedingPortions,
        const CleanPeriod& filterChange, const CleanPeriod& waterChange,
        const SamplePeriod& sample);
    // Getters
    uint16_t GetMinTemp() const { return minTemp; }

    uint16_t GetMaxTemp() const { return maxTemp; }

    uint16_t GetWaterLvlAlert() const { return waterLvlAlert; }

    float GetMinPh() const { return minPh; }

    float GetMaxPh() const { return maxPh; }

    CleanPeriod GetFilterChangePeriod() const { return filterChangePeriod; }

    CleanPeriod GetWaterChangePeriod() const { return waterChangePeriod; }

    uint16_t GetLightOnTime() const { return lightOnTime; }

    uint16_t GetLightOffTime() const { return lightOffTime; }

    uint16_t GetFilterOnTime() const { return filterOnTime; }

    uint16_t GetFilterOffTime() const { return filterOffTime; }

    uint16_t GetAirOnTime() const { return airOnTime; }

    uint16_t GetAirOffTime() const { return airOffTime; }

    uint16_t GetFeedingTime() const { return feedingTime; }

    SamplePeriod GetSamplePeriod() const { return samplePeriod; }

    uint8_t GetFeedingPortions() const { return feedingPortions; }

    // Setters
    void SetMinTemp(uint16_t minTemp);

    void SetMaxTemp(uint16_t maxTemp);

    void SetWaterLvlAlert(uint16_t waterLvlAlert);

    void SetMinPh(float minPh);

    void SetMaxPh(float maxPh);

    void SetFilterChangePeriod(CleanPeriod filterChangePeriod);

    void SetWaterChangePeriod(CleanPeriod waterChangePeriod);

    void SetLightOnTime(uint16_t lightOnTime);

    void SetLightOffTime(uint16_t lightOffTime);

    void SetFilterOnTime(uint16_t filterOnTime);

    void SetFilterOffTime(uint16_t filterOffTime);

    void SetAirOnTime(uint16_t airOnTime);

    void SetAirOffTime(uint16_t airOffTime);

    void SetFeedingTime(uint16_t feedingTime);

    void SetSamplePeriod(SamplePeriod samplePeriod);

    void SetFeedingPortions(uint8_t feedingPortions);
};

#endif