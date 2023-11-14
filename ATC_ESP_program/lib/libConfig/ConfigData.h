#ifndef ConfigData_h
#define ConfigData_h
#include "CleanPeriod.h"
#include "LightIntensity.h"
#include "SamplePeriod.h"
#include <Arduino.h>
#include <ctype.h>

#define MAX_TIMING_VAL 1440 // the maximum value the timings can have (24*60)
// 1 is 0:01 and 1440 is 0:00, 0 means no timing -> this is handled in the confighandler

#define MIN_PH 0.0F
#define MAX_PH 14.0F
#define MAX_WATER_LVL 100U

/**
 * This class represents the configuration of the whole system.
 * All timings periods and values are stored in this class.
 * It's including only the needed values, in the database this data is bigger!
 */
class ConfigData {
private:
    float minTemp; // Temperature
    float maxTemp;
    float minPh; // PH
    float maxPh;
    uint16_t outlet1On; // Timings are storing the value of
    uint16_t outlet1Off; // minutes past mindnight that day
    uint16_t outlet2On;
    uint16_t outlet2Off;
    uint16_t outlet3On;
    uint16_t outlet3Off;
    uint8_t waterLvlAlert; // max 100
    uint16_t feedingTime; // When to feed fish (1 time a day)
    uint8_t feedingPortions; // The amount of rotations the servo should make
    SamplePeriod samplePeriod; // How often to take samples

public:
    ConfigData(const float& minT, const float& maxT, const float& minPh, const float& maxPh, const uint16_t& OL1On,
        const uint16_t& OL1Off, const uint16_t& OL2On, const uint16_t& OL2Off, const uint16_t& OL3On,
        const uint16_t& OL3Off, const uint8_t& waterLvlAlert, const uint16_t& feedingTime, const uint8_t& foodPort,
        const SamplePeriod& samplePer);

    float GetMinTemp() const { return minTemp; }

    float GetMaxTemp() const { return maxTemp; }

    float GetMinPh() const { return minPh; }

    float GetMaxPh() const { return maxPh; }

    uint16_t GetOutlet1On() const { return outlet1On; }

    uint16_t GetOutlet1Off() const { return outlet1Off; }

    uint16_t GetOutlet2On() const { return outlet2On; }

    uint16_t GetOutlet2Off() const { return outlet2Off; }

    uint16_t GetOutlet3On() const { return outlet3On; }

    uint16_t GetOutlet3Off() const { return outlet3Off; }

    uint8_t GetWaterLvlAlert() const { return waterLvlAlert; }

    uint16_t GetFeedingTime() const { return feedingTime; }

    uint8_t GetFeedingPortions() const { return feedingPortions; }

    SamplePeriod GetSamplePeriod() const { return samplePeriod; }

    void SetMinTemp(float minTemp);

    void SetMaxTemp(float maxTemp);

    void SetMinPh(float minPh);

    void SetMaxPh(float maxPh);

    void SetOutlet1On(uint16_t outlet1On);

    void SetOutlet1Off(uint16_t outlet1Off);

    void SetOutlet2On(uint16_t outlet2On);

    void SetOutlet2Off(uint16_t outlet2Off);

    void SetOutlet3On(uint16_t outlet3On);

    void SetOutlet3Off(uint16_t outlet3Off);

    void SetWaterLvlAlert(uint8_t waterLvlAlert);

    void SetFeedingTime(uint16_t feedingTime);

    void SetFeedingPortions(uint8_t feedingPortions);

    void SetSamplePeriod(SamplePeriod samplePeriod);
};

#endif