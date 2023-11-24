#include "ConfigData.h"

ConfigData::ConfigData(const float& minT, const float& maxT, const float& minPh, const float& maxPh,
    const uint16_t& OL1On, const uint16_t& OL1Off, const uint16_t& OL2On, const uint16_t& OL2Off, const uint16_t& OL3On,
    const uint16_t& OL3Off, const uint8_t& waterLvlAlert, const uint16_t& feedingTime, const uint8_t& foodPort,
    const SamplePeriod& samplePer)
    : minTemp(minT)
    , maxTemp(maxT)
    , minPh(minPh)
    , maxPh(maxPh)
    , outlet1On(OL1On)
    , outlet1Off(OL1Off)
    , outlet2On(OL2On)
    , outlet2Off(OL2Off)
    , outlet3On(OL3Off)
    , outlet3Off(OL3Off)
    , waterLvlAlert(waterLvlAlert)
    , feedingTime(feedingTime)
    , feedingPortions(foodPort)
    , samplePeriod(samplePer)
{
}

void ConfigData::SetMinTemp(float minTemp) { minTemp = minTemp; }

void ConfigData::SetMaxTemp(float maxTemp) { maxTemp = maxTemp; }

void ConfigData::SetMinPh(float minPh)
{
    if (minPh >= MIN_PH && minPh < MAX_PH) {
        minPh = minPh;
    } else {
        Serial.println("Inavlid PH!" + String(minPh));
    }
}

void ConfigData::SetMaxPh(float maxPh)
{
    if (maxPh >= MIN_PH && maxPh < MAX_PH) {
        maxPh = maxPh;
    } else {
        Serial.println("Inavlid PH!" + String(maxPh));
    }
}

void ConfigData::SetOutlet1On(uint16_t outlet1On)
{
    if (outlet1On <= MAX_TIMING_VAL) {
        outlet1On = outlet1On;
    } else {
        Serial.println("Invalid timing! " + String(outlet1On));
    }
}

void ConfigData::SetOutlet1Off(uint16_t outlet1Off)
{
    if (outlet1Off <= MAX_TIMING_VAL) {
        outlet1Off = outlet1Off;
    } else {
        Serial.println("Invalid timing! " + String(outlet1Off));
    }
}

void ConfigData::SetOutlet2On(uint16_t outlet2On)
{
    if (outlet2On <= MAX_TIMING_VAL) {
        outlet2On = outlet2On;
    } else {
        Serial.println("Invalid timing! " + String(outlet2On));
    }
}

void ConfigData::SetOutlet2Off(uint16_t outlet2Off)
{
    if (outlet2Off <= MAX_TIMING_VAL) {
        outlet2Off = outlet2Off;
    } else {
        Serial.println("Invalid timing! " + String(outlet2Off));
    }
}

void ConfigData::SetOutlet3On(uint16_t outlet3On)
{
    if (outlet3On <= MAX_TIMING_VAL) {
        outlet3On = outlet3On;
    } else {
        Serial.println("Invalid timing! " + String(outlet3On));
    }
}

void ConfigData::SetOutlet3Off(uint16_t outlet3Off)
{
    if (outlet3Off <= MAX_TIMING_VAL) {
        outlet3Off = outlet3Off;
    } else {
        Serial.println("Invalid timing! " + String(outlet3Off));
    }
}

void ConfigData::SetWaterLvlAlert(uint8_t waterLvlAlert)
{
    if (waterLvlAlert <= MAX_WATER_LVL) {
        waterLvlAlert = waterLvlAlert;
    } else {
        Serial.println("Inavlid water level! " + String(waterLvlAlert));
    }
}

void ConfigData::SetFeedingTime(uint16_t feedingTime)
{
    if (feedingTime <= MAX_TIMING_VAL) {
        feedingTime = feedingTime;
    } else {
        Serial.println("Invalid timing! " + String(feedingTime));
    }
}

void ConfigData::SetFeedingPortions(uint8_t feedingPortions) { feedingPortions = feedingPortions; }

void ConfigData::SetSamplePeriod(SamplePeriod samplePeriod) { samplePeriod = samplePeriod; }

bool ConfigData::equals(const ConfigData* c)
{
    return this->minTemp == c->minTemp && this->maxTemp == c->maxTemp && this->minPh == c->minPh
        && this->maxPh == c->maxPh && this->outlet1On == c->outlet1On && this->outlet1Off == c->outlet1Off
        && this->outlet2On == c->outlet2On && this->outlet2Off == c->outlet2Off && this->outlet3On == c->outlet3On
        && this->outlet3Off == c->outlet3Off && this->waterLvlAlert == c->waterLvlAlert
        && this->feedingTime == c->feedingTime && this->feedingPortions == c->feedingPortions
        && this->samplePeriod == c->samplePeriod;
}