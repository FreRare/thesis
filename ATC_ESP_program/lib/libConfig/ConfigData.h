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
    uint16_t feedingTime; // When to feed fish (1 time a day)
    uint8_t feedingPortions; // The amount of rotations the servo should make
    SamplePeriod samplePeriod; // How often to take samples

public:
    ConfigData() = default;
    ConfigData(const float& minT, const float& maxT, const float& minPh, const float& maxPh, const uint16_t& OL1On,
        const uint16_t& OL1Off, const uint16_t& OL2On, const uint16_t& OL2Off, const uint16_t& OL3On,
        const uint16_t& OL3Off, const uint16_t& feedingTime, const uint8_t& foodPort,
        const SamplePeriod& samplePer);

    float getMinTemp() const { return minTemp; }

    float getMaxTemp() const { return maxTemp; }

    float getMinPh() const { return minPh; }

    float getMaxPh() const { return maxPh; }

    uint16_t getOutlet1On() const { return outlet1On; }

    uint16_t getOutlet1Off() const { return outlet1Off; }

    uint16_t getOutlet2On() const { return outlet2On; }

    uint16_t getOutlet2Off() const { return outlet2Off; }

    uint16_t getOutlet3On() const { return outlet3On; }

    uint16_t getOutlet3Off() const { return outlet3Off; }

    uint16_t getFeedingTime() const { return feedingTime; }

    uint8_t getFeedingPortions() const { return feedingPortions; }

    SamplePeriod getSamplePeriod() const { return samplePeriod; }

    void setMinTemp(float minTemp);

    void setMaxTemp(float maxTemp);

    void setMinPh(float minPh);

    void setMaxPh(float maxPh);

    void setOutlet1On(uint16_t outlet1On);

    void setOutlet1Off(uint16_t outlet1Off);

    void setOutlet2On(uint16_t outlet2On);

    void setOutlet2Off(uint16_t outlet2Off);

    void setOutlet3On(uint16_t outlet3On);

    void setOutlet3Off(uint16_t outlet3Off);

    void setFeedingTime(uint16_t feedingTime);

    void setFeedingPortions(uint8_t feedingPortions);

    void setSamplePeriod(SamplePeriod samplePeriod);

    /**
     * Checks if the gice config equals the current object
     */
    bool equals(const ConfigData* c);

    void print();
};

#endif