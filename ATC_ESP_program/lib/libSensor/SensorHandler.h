#ifndef SensorHandler_h
#define SensorHandler_h
#include "Debug.h"
#include "SensorData.h"
#include "deviceInit.h"
#include <DallasTemperature.h>
#include <OneWire.h>
#include <TimeLib.h>

// ############################### // Light intensity edges
#define PHOTORES_DARK_LIMIT 176U
#define PHOTORES_SHADY_LIMIT 282U
#define PHOTORES_MEDIUM_LIMIT 388U
#define PHOTORES_LIGHT_LIMIT 494U
// ################################
#define SENSOR_BUF_SIZE 10U // How many samples should be collected !!Shouldn't be higher than 256
#define SENSOR_DAT_ARRAY_AVG_WINDOW_DIFF SENSOR_BUF_SIZE / 5U
#define SENSOR_AVG_TIME_DIFF_MS 20U
// The ph sensor is using 5 V, but it's devided down to 3.3V level so this is what the analog port will reference to
#define REFERECNCE_VOLTAGE 3.3f
#define ADC_RESOLUTION 1024.0f
#define LIGHT_SENSOR_CH 2U
#define WATER_SENSOR_CH 0U
#define PH_SENSOR_CH 1U

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
    ~SensorHandler();
    /**
     * Reads all the sensors and makes a SensorData object out of it
     * @returns - The SensorData object created from the sensors' currently measured data
     * @public
     * There's a 1s delay between each sensor's measuring (switching time and adc cleanse)
     * Each sensor sample builds up from the average of 10 samples taken with 20ms delays
     * So the total runtime of the function is: (num of sensors - 1) * 1000 + (delta sample time * num of sensors * 20)
     * [ms]
     */
    void readSensors();
    SensorData* getLastSamples() { return this->lastSamples; }
};

#endif