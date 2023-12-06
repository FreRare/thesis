#include "deviceInit.h"

void pinSetup()
{
    pinMode(DIGITAL_TEMP_SENSOR_PIN, INPUT);
    pinMode(RELAY_PIN, OUTPUT);
    pinMode(ANALOG_SENSOR_PIN, INPUT);
    pinMode(MUX_SELECT_A, OUTPUT);
    pinMode(MUX_SELECT_B, OUTPUT);
    pinMode(FEEDER_SERVO_PIN, OUTPUT);
    pinMode(WATER_LVL_SENSOR_POWER, OUTPUT);
    pinMode(CALIBRATION_BTN_PIN, INPUT);
}