#include "deviceInit.h"

void pinSetup()
{
    pinMode(RELAY_PIN, OUTPUT);
    pinMode(MUX_SELECT_A, OUTPUT);
    pinMode(MUX_SELECT_B, OUTPUT);
    pinMode(ANALOG_SENSOR_PIN, INPUT);
    pinMode(DIGITAL_TEMP_SENSOR_PIN, INPUT);
}