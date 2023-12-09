#include "SensorHandler.h"

/**
 * @brief Selects the given channel (0-3) on the multiplexer
 * @param channel - the channel we want to select (0-3)
 */
void selectMux(uint8_t channel)
{
    switch (channel) {
    case 0:
        digitalWrite(MUX_SELECT_A, LOW);
        digitalWrite(MUX_SELECT_B, LOW);
        return;
    case 1:
        digitalWrite(MUX_SELECT_A, HIGH);
        digitalWrite(MUX_SELECT_B, LOW);
        return;
    case 2:
        digitalWrite(MUX_SELECT_A, LOW);
        digitalWrite(MUX_SELECT_B, HIGH);
        return;
    case 3:
        digitalWrite(MUX_SELECT_A, HIGH);
        digitalWrite(MUX_SELECT_B, HIGH);
        return;
    default:
        digitalWrite(MUX_SELECT_A, LOW);
        digitalWrite(MUX_SELECT_B, LOW);
    }
}

SensorHandler::SensorHandler()
    : oneWire(DIGITAL_TEMP_SENSOR_PIN)
    , sensors(&oneWire)
{
    this->sensors.begin(); // Begin the onewire transmission for sensors
    this->phCalibration = 0.8f;
}

float SensorHandler::readTempSensor()
{
    this->sensors.requestTemperatures();
    float temperature = sensors.getTempCByIndex(0);
    return temperature;
}

LightIntensity SensorHandler::readLightSensor()
{
    const uint16_t value = analogRead(ANALOG_SENSOR_PIN);
    Serial.print("Light measured: ");
    Serial.println(value);
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
    return 100;
}

float SensorHandler::readPhSensor()
{
    uint16_t phBuffer[PH_SENSOR_BUF_SIZE];
    for (uint8_t i = 0; i < PH_SENSOR_BUF_SIZE; i++) {
        phBuffer[i] = analogRead(ANALOG_SENSOR_PIN);
        Serial.print("Ph value: ");
        Serial.println(phBuffer[i]);
        delay(20);
    }
    uint16_t temp = 0u;
    for (uint8_t i = 0; i < PH_SENSOR_BUF_SIZE - 1; i++) {
        for (uint8_t j = i + 1; j < PH_SENSOR_BUF_SIZE; j++) {
            if (phBuffer[i] > phBuffer[j]) {
                temp = phBuffer[i];
                phBuffer[i] = phBuffer[j];
                phBuffer[j] = temp;
            }
        }
    }
    uint16_t avgValue = 0u;
    uint8_t startValue = PH_SENSOR_BUF_SIZE / 5;
    uint8_t endValue = PH_SENSOR_BUF_SIZE - (PH_SENSOR_BUF_SIZE / 5);

    for (uint8_t i = startValue; i < endValue; i++) {
        avgValue += phBuffer[i];
    }
    float avg = avgValue / (endValue - startValue);
    float phValue = (float)avg * (REFERECNCE_VOLTAGE / ADC_RESOLUTION);
    float ph = (3.3f * phValue) + this->phCalibration;
    Serial.print("Ph measured: ");
    Serial.println(ph);
    return ph;
}

void SensorHandler::readSensors()
{
    float temp = this->readTempSensor();
    selectMux(LIGHT_SENSOR_CH);
    delay(1500);
    LightIntensity light = this->readLightSensor();
    selectMux(WATER_SENSOR_CH);
    delay(1500);
    uint8_t water = this->readWaterSensor();
    selectMux(PH_SENSOR_CH);
    delay(1500);
    float ph = this->readPhSensor();
    this->lastSamples = new SensorData(temp, ph, light, water, now());
}