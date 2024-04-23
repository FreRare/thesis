#include "SensorHandler.h"

SensorHandler::SensorHandler()
    : oneWire(DIGITAL_TEMP_SENSOR_PIN)
    , sensors(&oneWire)
    , lastSamples(nullptr)
{
    this->sensors.begin(); // Begin the onewire transmission for sensors
    this->phCalibration = 0.8f; // TODO: Recalibrate
    // this->readSensors();
}

SensorHandler::~SensorHandler()
{
    delete this->lastSamples;
    this->lastSamples = nullptr;
}


void SensorHandler::readSensors()
{
    float temp = this->readTempSensor();
    selectMux(LIGHT_SENSOR_CH);
    delay(1000);
    LightIntensity light = this->readLightSensor();
    selectMux(WATER_SENSOR_CH);
    delay(1000);
    bool water = this->readWaterSensor();
    selectMux(PH_SENSOR_CH);
    delay(1000);
    float ph = this->readPhSensor();
    this->lastSamples = new SensorData(temp, ph, light, water, now());
}

float SensorHandler::readTempSensor()
{
    float tempBuffer[SENSOR_BUF_SIZE];
    for(uint8_t i=0;i<SENSOR_BUF_SIZE;i++){
        this->sensors.requestTemperatures();
        tempBuffer[i] = sensors.getTempCByIndex(0);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }
    float temperature = this->getValidSensorValue<float>(tempBuffer);
    Serial.print("Temperature measured: ");
    Serial.println(temperature);
    if(temperature < TEMP_RECURSE_LIMIT){
        Serial.println("Calling temperature sensor sampler again..");
        temperature = this->readTempSensor();
    }
    return temperature;
}

LightIntensity SensorHandler::readLightSensor()
{
    uint16_t lightBuffer[SENSOR_BUF_SIZE];
    // Get samples
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        lightBuffer[i] = analogRead(ANALOG_SENSOR_PIN);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }
    const float value = this->getValidSensorValue<uint16_t>(lightBuffer);
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

bool SensorHandler::readWaterSensor()
{
    uint16_t waterBuffer[SENSOR_BUF_SIZE];
    // Get samples
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        waterBuffer[i] = analogRead(ANALOG_SENSOR_PIN);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }
    const uint16_t value = this->getValidSensorValue<uint16_t>(waterBuffer);
    Serial.print("Water measured: ");
    Serial.println(value);
    return (value > 1000U);
}

float SensorHandler::readPhSensor()
{
    uint16_t phBuffer[SENSOR_BUF_SIZE];
    // Get samples
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE; i++) {
        phBuffer[i] = analogRead(ANALOG_SENSOR_PIN);
        delay(SENSOR_AVG_TIME_DIFF_MS);
    }
    const float avg = this->getValidSensorValue<uint16_t>(phBuffer);
    // Calculate PH value from the avg
    float phValue = (float)avg * (REFERECNCE_VOLTAGE / ADC_RESOLUTION);
    float ph = (3.3f * phValue) + this->phCalibration; // TODO: Coorigate
    Serial.print("Ph measured: ");
    Serial.println(ph);
    return ph;
}

template<typename SensorCalcT> float SensorHandler::getValidSensorValue(SensorCalcT* buffer){
    // Sort the array so we can have the middle values
    SensorCalcT temp = 0u;
    for (uint8_t i = 0; i < SENSOR_BUF_SIZE - 1; i++) {
        for (uint8_t j = i + 1; j < SENSOR_BUF_SIZE; j++) {
            if (buffer[i] > buffer[j]) {
                temp = buffer[i];
                buffer[i] = buffer[j];
                buffer[j] = temp;
            }
        }
    }
    // Calculating average in the range of given below (in case of 10 samples, the middle 6)
    SensorCalcT avgSum = 0u;
    uint8_t startValue = (uint8_t)SENSOR_BUF_SIZE / SENSOR_MEAN_START_DIVIDER;
    uint8_t endValue = (uint8_t)SENSOR_BUF_SIZE - startValue;
    for (uint8_t i = startValue; i < endValue; i++) {
        avgSum += buffer[i];
    }
    return avgSum / (endValue - startValue);
}