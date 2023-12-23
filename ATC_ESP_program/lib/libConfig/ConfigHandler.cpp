#include "ConfigHandler.h"

MemoryHandler* ConfigHandler::memHandler = MemoryHandler::getInstance();

ConfigHandler::ConfigHandler()
    : configuration(nullptr)
{
    this->loadConfigDataFromMemory();
}

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
    if (this->configuration == nullptr) {
        Serial.println("ConfigHandler::Status handlig: Config is null!");
        return ConfigStatus::ERROR;
    }
    const uint16_t minutesSinceMidnight = (hour() * 60) + minute();
    // Making sure data is not null
    if (data != nullptr) {
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
        if (data->getWaterLvl() < 1) {
            // TODO: This 1 should be a valid enum number [OK, MEDIUM, LOW] enum for water level
            return ConfigStatus::LOW_WATER;
        }
        // ! OUTLET 1 should be the light switching outlet
        // If light should be on but measured light is low we have a broken light
        if (minutesSinceMidnight > this->configuration->getOutlet1On()
            && minutesSinceMidnight < this->configuration->getOutlet1Off()
            && data->getLightAmount() <= LightIntensity::SHADY) {
            return ConfigStatus::BROKEN_LIGHT;
        }
    }
    // Outlet switching
    if (minutesSinceMidnight >= this->configuration->getOutlet1On()
        && minutesSinceMidnight < this->configuration->getOutlet1Off() && !ActuatorHandler::channelStates[0]) {
        return ConfigStatus::OUTLET_1_ON;
    }
    if (minutesSinceMidnight > this->configuration->getOutlet1Off() && ActuatorHandler::channelStates[0]) {
        return ConfigStatus::OUTLET_1_OFF;
    }
    if (minutesSinceMidnight >= this->configuration->getOutlet2On()
        && minutesSinceMidnight < this->configuration->getOutlet2Off() && !ActuatorHandler::channelStates[1]) {
        return ConfigStatus::OUTLET_2_ON;
    }
    if (minutesSinceMidnight > this->configuration->getOutlet2Off() && ActuatorHandler::channelStates[1]) {
        return ConfigStatus::OUTLET_2_OFF;
    }
    if (minutesSinceMidnight >= this->configuration->getOutlet3On()
        && minutesSinceMidnight < this->configuration->getOutlet3Off() && !ActuatorHandler::channelStates[2]) {
        return ConfigStatus::OUTLET_3_ON;
    }
    if (minutesSinceMidnight > this->configuration->getOutlet3Off() && ActuatorHandler::channelStates[2]) {
        return ConfigStatus::OUTLET_3_OFF;
    }
    if (minutesSinceMidnight == this->configuration->getFeedingTime()) {
        return ConfigStatus::FEEDING_TIME;
    }
    // Sample periods
    const uint16_t hours = hour();
    const uint16_t minutes = minute();
    const uint8_t samplePeriodTime = this->configuration->getSamplePeriod();
    switch (samplePeriodTime) {
    case SamplePeriod::S_15_MIN:
        if (minutes % 15 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_30_MIN:
        if (minutes % 30 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_1_HOUR:
        if (minutes == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_2_HOUR:
        if (hours % 2 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_3_HOUR:
        if (hours % 3 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_6_HOUR:
        if (hours % 6 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_12_HOUR:
        if (hours % 12 == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    case SamplePeriod::S_1_DAY:
        if (hours == 12 && minutes == 0) {
            return ConfigStatus::SAMPLE_TIME;
        }
        break;
    default:
        Serial.println("ConfigHandler:: Status check: Sensor sample period is NONE of the predefined states!");
        return ConfigStatus::ERROR;
    }
    return ConfigStatus::OK_STATUS;
}