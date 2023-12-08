#include "deviceInit.h"

void pinSetup()
{
    pinMode(DIGITAL_TEMP_SENSOR_PIN, INPUT);
    pinMode(ANALOG_SENSOR_PIN, INPUT);
    pinMode(MUX_SELECT_A, OUTPUT);
    pinMode(MUX_SELECT_B, OUTPUT);
    pinMode(CALIBRATION_BTN_PIN, INPUT);
    pinMode(RELAY_CH1_PIN, OUTPUT);
    pinMode(RELAY_CH2_PIN, OUTPUT);
    pinMode(RELAY_CH3_PIN, OUTPUT);
    // pinMode(FEEDER_MOTOR_PIN, OUTPUT);
}