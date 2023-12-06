#ifndef SensorHandler_h
#define SensorHandler_h
#include "SensorData.h"
#include "deviceInit.h"
#include <DallasTemperature.h>
#include <OneWire.h>
#include <TimeLib.h>

#define PHOTORES_DARK_LIMIT 176
#define PHOTORES_SHADY_LIMIT 282
#define PHOTORES_MEDIUM_LIMIT 388
#define PHOTORES_LIGHT_LIMIT 494
#define PH_SENSOR_BUF_SIZE 10
// The ph sensor is using 5 V, but it's devided down to 3.3V level so this is what the analog port will reference to
#define REFERECNCE_VOLTAGE 3.3f
#define ADC_RESOLUTION 1024.0f
#define LIGHT_SENSOR_CH 2
#define WATER_SENSOR_CH 0
#define PH_SENSOR_CH 1

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
     * @private
     */
    float readTempSensor();
    LightIntensity readLightSensor();
    uint8_t readWaterSensor();
    float readPhSensor();
    float phCalibration;

public:
    SensorHandler();
    /**
     * Reads all the sensors and makes a SensorData object out of it
     * @returns - The SensorData object created from the sensors' currently measured data
     * @public
     */
    void readSensors();
    SensorData* getLastSamples() { return this->lastSamples; }
};

#endif