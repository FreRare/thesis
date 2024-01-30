#include "ConfigData.h"

ConfigData::ConfigData(const float& minT, const float& maxT, const float& minPh, const float& maxPh,
    const uint16_t& OL1On, const uint16_t& OL1Off, const uint16_t& OL2On, const uint16_t& OL2Off, const uint16_t& OL3On,
    const uint16_t& OL3Off, const uint16_t& feedingTime, const uint8_t& foodPort, const SamplePeriod& samplePer)
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
    , feedingTime(feedingTime)
    , feedingPortions(foodPort)
    , samplePeriod(samplePer)
{
}

void ConfigData::setMinTemp(float minTemp) { minTemp = minTemp; }

void ConfigData::setMaxTemp(float maxTemp) { maxTemp = maxTemp; }

void ConfigData::setMinPh(float minPh)
{
    if (minPh >= MIN_PH && minPh < MAX_PH) {
        minPh = minPh;
    } else {
        Serial.println("Inavlid PH!" + String(minPh));
    }
}

void ConfigData::setMaxPh(float maxPh)
{
    if (maxPh >= MIN_PH && maxPh < MAX_PH) {
        maxPh = maxPh;
    } else {
        Serial.println("Inavlid PH!" + String(maxPh));
    }
}

void ConfigData::setOutlet1On(uint16_t outlet1On)
{
    if (outlet1On <= MAX_TIMING_VAL) {
        outlet1On = outlet1On;
    } else {
        Serial.println("Invalid timing! " + String(outlet1On));
    }
}

void ConfigData::setOutlet1Off(uint16_t outlet1Off)
{
    if (outlet1Off <= MAX_TIMING_VAL) {
        outlet1Off = outlet1Off;
    } else {
        Serial.println("Invalid timing! " + String(outlet1Off));
    }
}

void ConfigData::setOutlet2On(uint16_t outlet2On)
{
    if (outlet2On <= MAX_TIMING_VAL) {
        outlet2On = outlet2On;
    } else {
        Serial.println("Invalid timing! " + String(outlet2On));
    }
}

void ConfigData::setOutlet2Off(uint16_t outlet2Off)
{
    if (outlet2Off <= MAX_TIMING_VAL) {
        outlet2Off = outlet2Off;
    } else {
        Serial.println("Invalid timing! " + String(outlet2Off));
    }
}

void ConfigData::setOutlet3On(uint16_t outlet3On)
{
    if (outlet3On <= MAX_TIMING_VAL) {
        outlet3On = outlet3On;
    } else {
        Serial.println("Invalid timing! " + String(outlet3On));
    }
}

void ConfigData::setOutlet3Off(uint16_t outlet3Off)
{
    if (outlet3Off <= MAX_TIMING_VAL) {
        outlet3Off = outlet3Off;
    } else {
        Serial.println("Invalid timing! " + String(outlet3Off));
    }
}

void ConfigData::setFeedingTime(uint16_t feedingTime)
{
    if (feedingTime <= MAX_TIMING_VAL) {
        feedingTime = feedingTime;
    } else {
        Serial.println("Invalid timing! " + String(feedingTime));
    }
}

void ConfigData::setFeedingPortions(uint8_t feedingPortions) { feedingPortions = feedingPortions; }

void ConfigData::setSamplePeriod(SamplePeriod samplePeriod) { samplePeriod = samplePeriod; }

bool ConfigData::equals(const ConfigData* c)
{
    return this->minTemp == c->minTemp && this->maxTemp == c->maxTemp && this->minPh == c->minPh
        && this->maxPh == c->maxPh && this->outlet1On == c->outlet1On && this->outlet1Off == c->outlet1Off
        && this->outlet2On == c->outlet2On && this->outlet2Off == c->outlet2Off && this->outlet3On == c->outlet3On
        && this->outlet3Off == c->outlet3Off && this->feedingTime == c->feedingTime
        && this->feedingPortions == c->feedingPortions && this->samplePeriod == c->samplePeriod;
}

char* ConfigData::print()
{
    static char logPrint[512];
    sprintf(logPrint,
        "CONFIG: MinT: %f, MaxT: %f, MinPh: %f, MaxPh: %f, OL1N: %d, OL1F: %d, OL2N: %d, OL2F: %d, OL3N: %d, OL3F: %d, "
        "Feeding time: %d, Portions: %d, Sample period: %d ------",
        this->minTemp, this->maxTemp, this->minPh, this->maxPh, this->outlet1On, this->outlet1Off, this->outlet2On,
        this->outlet2Off, this->outlet3On, this->outlet3Off, this->feedingTime, this->feedingPortions,
        this->samplePeriod);
    uint8_t logLen = 0U;
    while (logPrint[logLen] != '-' && logPrint[logLen + 1] != '-') {
        logLen++;
    }
    logPrint[logLen + 1] = '\0';
    return logPrint;
}