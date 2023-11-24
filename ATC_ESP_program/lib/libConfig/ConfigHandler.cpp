#include "ConfigHandler.h"

MemoryHandler* ConfigHandler::memHandler = MemoryHandler::getInstance();

ConfigHandler::ConfigHandler()
    : configuration(this->loadConfigDataFromMemory())
{
}

ConfigHandler::~ConfigHandler()
{
    delete this->memHandler;
    delete this->configuration;
}

void ConfigHandler::saveConfigData(const ConfigData& data) { ConfigHandler::memHandler->writeConfigData(data); }

ConfigData ConfigHandler::loadConfigDataFromMemory()
{
    ConfigData loadedData = ConfigHandler::memHandler->readConfigData();
    Serial.println("Config data loaded!");
    return loadedData;
}

ConfigStatus ConfigHandler::checkFullfillmentStatus(const SensorData& data, const time_t& timeNow)
{
    return ConfigStatus::OK_STATUS;
}