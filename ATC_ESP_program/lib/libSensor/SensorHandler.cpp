#include "SensorHandler.h"

SensorHandler::SensorHandler()
    : oneWire(DIGITAL_TEMP_SENSOR_PIN)
    , sensors(&oneWire)
    , lastSamples(nullptr)
{
    this->sensors.begin(); // Begin the onewire transmission for sensors
    this->phCalibration = 0.8f; // TODO: Recalibrate
}
SensorHandler::~SensorHandler()
{
    delete this->lastSamples;
    this->lastSamples = nullptr;
}

float SensorHandler::readTempSensor()
{
    float tempBuffer[SENSOR_BUF_SIZE];
    // Get samples
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        this->sensors.requestTemperatures();
        tempBuffer[i] = sensors.getTempCByIndex(0);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }
    // Sort array
    float temp = 0.0f;
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        for (uint8_t j = i + 1; j < SENSOR_BUF_SIZE; j++) {
            if (tempBuffer[i] > tempBuffer[j]) {
                temp = tempBuffer[i];
                tempBuffer[i] = tempBuffer[j];
                tempBuffer[j] = temp;
            }
        }
    }

    float sum = 0.0f;
    // Calculating average in the range of given below (in case of 10 samples, the middle 6)
    uint8_t startValue = (uint8_t)SENSOR_DAT_ARRAY_AVG_WINDOW_DIFF;
    uint8_t endValue = SENSOR_BUF_SIZE - startValue;
    for (uint8_t i = startValue; i < endValue; i++) {
        sum += tempBuffer[i];
    }
    float temperature = sum / (endValue - startValue);
    Serial.print("Temperature measured: ");
    Serial.println(temperature);
    if(temperature < 0){
        Serial.println("Calling temperature sensor sampler again..");
        temperature = this->readTempSensor();
    }
    return temperature;
}

LightIntensity SensorHandler::readLightSensor()
{
    uint16_t lightBuffer[SENSOR_BUF_SIZE];

    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        lightBuffer[i] = analogRead(ANALOG_SENSOR_PIN);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }

    uint16_t temp = 0u;
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        for (uint8_t j = i + 1; j < SENSOR_BUF_SIZE; j++) {
            if (lightBuffer[i] > lightBuffer[j]) {
                temp = lightBuffer[i];
                lightBuffer[i] = lightBuffer[j];
                lightBuffer[j] = temp;
            }
        }
    }

    uint16_t avgSum = 0u;
    uint8_t startValue = (uint8_t)SENSOR_BUF_SIZE / (SENSOR_BUF_SIZE / 2);
    uint8_t endValue = (uint8_t)SENSOR_BUF_SIZE - (SENSOR_BUF_SIZE / 5);
    for (uint8_t i = startValue; i < endValue; i++) {
        avgSum += lightBuffer[i];
    }
    float value = avgSum / (endValue - startValue);
    Serial.print("Light measured: ");
    Serial.println(value);
    // Return the enum value due to the measured value
    if (value <= PHOTORES_DARK_LIMIT) {
        return LightIntensity::DARK;
    } else if (PHOTORES_DARK_LIMIT < value && value <= PHOTORES_SHADY_LIMIT) {
        return LightIntensity::SHADY;
    } else if (PHOTORES_SHADY_LIMIT < value && value <= PHOTORES_MEDIUM_LIMIT) {
        return LightIntensity::MEDIUM;
    } else if (PHOTORES_MEDIUM_LIMIT < value && value <= PHOTORES_LIGHT_LIMIT) {
        return LightIntensity::LIGHT;
    } else {
        return LightIntensity::BRIGHT;
    }
}

uint8_t SensorHandler::readWaterSensor()
{
    const uint16_t value = analogRead(ANALOG_SENSOR_PIN);
    Serial.print("Water measured: ");
    Serial.println(value);
    // TODO: return valid percentage
    // TODO: Get a new water level sensor and see how it works
    return 100;
}

float SensorHandler::readPhSensor()
{
    uint16_t phBuffer[SENSOR_BUF_SIZE];
    // Get samples
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        phBuffer[i] = analogRead(ANALOG_SENSOR_PIN);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }
    // Sort the array so we can have the middle values
    uint16_t temp = 0u;
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE - 1; i++) {
        for (uint8_t j = i + 1; j < SENSOR_BUF_SIZE; j++) {
            if (phBuffer[i] > phBuffer[j]) {
                temp = phBuffer[i];
                phBuffer[i] = phBuffer[j];
                phBuffer[j] = temp;
            }
        }
    }
    // Calculating average in the range of given below (in case of 10 samples, the middle 6)
    uint16_t avgSum = 0u;
    uint8_t startValue = (uint8_t)SENSOR_BUF_SIZE / (SENSOR_BUF_SIZE / 2);
    uint8_t endValue = (uint8_t)SENSOR_BUF_SIZE - (SENSOR_BUF_SIZE / 5);
    for (uint8_t i = startValue; i < endValue; i++) {
        avgSum += phBuffer[i];
    }
    float avg = avgSum / (endValue - startValue);
    // Calculate PH value from the avg
    float phValue = (float)avg * (REFERECNCE_VOLTAGE / ADC_RESOLUTION);
    float ph = (3.3f * phValue) + this->phCalibration; // Coorigate with calibration value
    Serial.print("Ph measured: ");
    Serial.println(ph);
    return ph;
}

void SensorHandler::readSensors()
{
    float temp = this->readTempSensor();
    selectMux(LIGHT_SENSOR_CH);
    delay(1000);
    LightIntensity light = this->readLightSensor();
    selectMux(WATER_SENSOR_CH);
    delay(1000);
    uint8_t water = this->readWaterSensor();
    selectMux(PH_SENSOR_CH);
    delay(1000);
    float ph = this->readPhSensor();
    this->lastSamples = new SensorData(temp, ph, light, water, now());
}