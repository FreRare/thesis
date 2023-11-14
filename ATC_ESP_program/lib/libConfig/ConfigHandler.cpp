#include "ConfigHandler.h"

MemoryHandler* ConfigHandler::memHandler = MemoryHandler::getInstance();

ConfigHandler::ConfigHandler()
    : configuration(this->loadConfigDataFromMemory())
{
}

ConfigData ConfigHandler::loadConfigDataFromMemory()
{
    ConfigData loadedData = ConfigHandler::memHandler->readConfigData();
    Serial.println("Config data loaded!");
    return loadedData;
}

>>>>>>> main
ConfigStatus ConfigHandler::checkFullfillmentStatus(const SensorData& data, const time_t& timeNow)
{
    return ConfigStatus::OK_STATUS;
}