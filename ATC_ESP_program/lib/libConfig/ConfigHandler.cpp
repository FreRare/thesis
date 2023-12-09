#include "ConfigHandler.h"

MemoryHandler* ConfigHandler::memHandler = MemoryHandler::getInstance();

ConfigHandler::ConfigHandler() { this->loadConfigDataFromMemory(); }

ConfigHandler::~ConfigHandler()
{
    delete this->memHandler;
    delete this->configuration;
}

void ConfigHandler::saveConfigData(ConfigData* data) { ConfigHandler::memHandler->writeConfigData(data); }

void ConfigHandler::loadConfigDataFromMemory()
{
    ConfigData* loadedData = ConfigHandler::memHandler->readConfigData();
    this->configuration = loadedData;
}

ConfigStatus ConfigHandler::checkFullfillmentStatus(const SensorData* data)
{
    if (data == nullptr) {
        return ConfigStatus::ERROR;
    }
    // Temp, Ph and water level
    if (data->getTemperature() < this->configuration->getMinTemp()) {
        return ConfigStatus::LOW_TEMP;
    }
    if (data->getTemperature() > this->configuration->getMaxTemp()) {
        return ConfigStatus::HIGH_TEMP;
    }
    if (data->getPh() < this->configuration->getMinPh()) {
        return ConfigStatus::LOW_PH;
    }
    if (data->getPh() > this->configuration->getMaxPh()) {
        return ConfigStatus::HIGH_PH;
    }
    if (data->getWaterLvl() < this->configuration->getWaterLvlAlert()) {
        return ConfigStatus::LOW_WATER;
    }
    // Outlet switching
    const uint16_t minutesSinceMidnight = (hour() * 60) + minute();
    if (minutesSinceMidnight >= this->configuration->getOutlet1On()) {
        return ConfigStatus::OUTLET_1_ON;
    }
    if (minutesSinceMidnight > this->configuration->getOutlet1Off()) {
        return ConfigStatus::OUTLET_1_OFF;
    }
    if (minutesSinceMidnight >= this->configuration->getOutlet2On()) {
        return ConfigStatus::OUTLET_2_ON;
    }
    if (minutesSinceMidnight > this->configuration->getOutlet2Off()) {
        return ConfigStatus::OUTLET_2_OFF;
    }
    if (minutesSinceMidnight >= this->configuration->getOutlet3On()) {
        return ConfigStatus::OUTLET_3_ON;
    }
    if (minutesSinceMidnight > this->configuration->getOutlet3Off()) {
        return ConfigStatus::OUTLET_3_OFF;
    }
    if (minutesSinceMidnight == this->configuration->getFeedingTime()) {
        return ConfigStatus::FEEDING_TIME;
    }
    // Sample periods
    const uint16_t hours = hour();
    const uint16_t minutes = minute();
    switch (this->configuration->getSamplePeriod()) {
    case SamplePeriod::S_15_MIN:
        if (minutes % 15 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_30_MIN:
        if (minutes % 30 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_1_HOUR:
        if (minutes == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_2_HOUR:
        if (hours % 2 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_3_HOUR:
        if (hours % 3 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_6_HOUR:
        if (hours % 6 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_12_HOUR:
        if (hours % 12 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    case SamplePeriod::S_1_DAY:
        if (hours == 12 && minutes == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
    default:
        return ConfigStatus::ERROR;
    }
}