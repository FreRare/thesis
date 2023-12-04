#ifndef SensorHandler_h
#define SensorHandler_h
#include "SensorData.h"
#include "deviceInit.h"
#include <DallasTemperature.h>
#include <OneWire.h>

/**
 * This class is handling the different sensors and is able to read their data
 * @headerfile
 * @class
 */
class SensorHandler {
private:
    /**
     * @private
     * The OneWire object used by the DallasTemperature object
     */
    OneWire oneWire;
    /**
     * @private
     * The DallasTemperature object to access the sensors
     */
    DallasTemperature sensors;
    /**
     * @private
     * The vector which stores the samples of a day
     */
    SensorData* lastSamples;
    /**
     * Reads the temperature sensor
     * @returns - The read temperature
     */
    float readTempSensor();
    uint16_t readLightSensor();
    uint16_t readWaterSensor();
    float readPhSensor();

public:
    SensorHandler();
    /**
     * Reads all the sensors and makes a SensorData object out of it
     * @returns - The SensorData object created from the sensors' data
     * @public
     */
    SensorData readSensors();
    SensorData getLastSamples();
};

#endif