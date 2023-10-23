#include "ConfigData.h"

ConfigData::ConfigData(const uint16_t& minTemp, const uint16_t& maxTemp, const uint16_t& waterLvlAlert,
    const uint16_t& lightOnTime, const uint16_t& lightOffTime, const uint16_t& filterOnTime,
    const uint16_t& filterOffTime, const uint16_t& airOnTime, const uint16_t& airOffTime, const uint16_t& feedingTime,
    const float& minPh, const float& maxPh, const byte& feedingPortions, const LightIntensity& prefLight,
    const CleanPeriod& filterChange, const CleanPeriod& waterChange, const SamplePeriod& sample)
    : minTemp(minTemp)
    , maxTemp(maxTemp)
    , preferredLight(prefLight)
    , minPh(minPh)
    , maxPh(maxPh)
    , filterChangePeriod(filterChange)
    , waterChangePeriod(waterChange)
    , lightOnTime(lightOnTime)
    , lightOffTime(lightOffTime)
    , filterOnTime(filterOnTime)
    , filterOffTime(filterOffTime)
    , airOnTime(airOnTime)
    , airOffTime(airOffTime)
    , feedingTime(feedingTime)
    , feedingPortions(feedingPortions)
{
}
/*******************************************
 * Start of setters
 *********************************************/

void ConfigData::SetMinTemp(uint16_t minTemp)
{
    if (minTemp < 40) {
        minTemp = minTemp;
    }
}

void ConfigData::SetMaxTemp(uint16_t maxTemp)
{
    if (maxTemp < 40)
        maxTemp = maxTemp;
}

void ConfigData::SetPreferredLight(LightIntensity preferredLight) { preferredLight = preferredLight; }

void ConfigData::SetWaterLvlAlert(uint16_t waterLvlAlert)
{
    if (waterLvlAlert < 100)
        waterLvlAlert = waterLvlAlert;
}

void ConfigData::SetMinPh(float minPh)
{
    if (minPh <= MAX_PH && minPh >= MIN_PH)
        minPh = minPh;
}

void ConfigData::SetMaxPh(float maxPh)
{
    if (maxPh <= MAX_PH && maxPh >= MIN_PH)
        maxPh = maxPh;
}

void ConfigData::SetFilterChangePeriod(CleanPeriod filterChangePeriod) { filterChangePeriod = filterChangePeriod; }

void ConfigData::SetWaterChangePeriod(CleanPeriod waterChangePeriod) { waterChangePeriod = waterChangePeriod; }

void ConfigData::SetLightOnTime(uint16_t lightOnTime)
{
    if (lightOnTime <= MAX_TIMING_VAL)
        lightOnTime = lightOnTime;
}

void ConfigData::SetLightOffTime(uint16_t lightOffTime)
{
    if (lightOffTime <= MAX_TIMING_VAL)
        lightOffTime = lightOffTime;
}

void ConfigData::SetFilterOnTime(uint16_t filterOnTime)
{
    if (filterOnTime <= MAX_TIMING_VAL)
        filterOnTime = filterOnTime;
}

void ConfigData::SetFilterOffTime(uint16_t filterOffTime)
{
    if (filterOffTime <= MAX_TIMING_VAL)
        filterOffTime = filterOffTime;
}

void ConfigData::SetAirOnTime(uint16_t airOnTime)
{
    if (airOnTime <= MAX_TIMING_VAL)
        airOnTime = airOnTime;
}

void ConfigData::SetAirOffTime(uint16_t airOffTime)
{
    if (airOffTime <= MAX_TIMING_VAL)
        airOffTime = airOffTime;
}

void ConfigData::SetFeedingTime(uint16_t feedingTime)
{
    if (feedingTime <= MAX_TIMING_VAL)
        feedingTime = feedingTime;
}

void ConfigData::SetSamplePeriod(SamplePeriod samplePeriod) { samplePeriod = samplePeriod; }

void ConfigData::SetFeedingPortions(byte feedingPortions) { feedingPortions = feedingPortions; }

/*******************************************
 * End of setters
 ******************************************/