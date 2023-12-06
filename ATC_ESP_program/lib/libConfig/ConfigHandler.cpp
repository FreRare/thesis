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

ConfigStatus ConfigHandler::checkFullfillmentStatus(const SensorData& data) { return ConfigStatus::OK_STATUS; }