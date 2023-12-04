#include "SensorHandler.h"

SensorHandler::SensorHandler()
    : oneWire(DIGITAL_TEMP_SENSOR_PIN)
    , sensors(&oneWire)
{
    this->sensors.begin(); // Begin the onewire transmission for sensors
}

float SensorHandler::readTempSensor()
{
    this->sensors.requestTemperatures();
    float temperature = sensors.getTempCByIndex(0);
    return temperature;
}