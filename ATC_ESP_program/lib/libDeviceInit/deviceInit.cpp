#include "deviceInit.h"

void pinSetup()
{
    // IN
    pinMode(ANALOG_SENSOR_PIN, INPUT);
    pinMode(DIGITAL_TEMP_SENSOR_PIN, INPUT);
    // OUT
    pinMode(MUX_SELECT_A, OUTPUT);
    pinMode(MUX_SELECT_B, OUTPUT);
    pinMode(SHIFT_REGISTER_CLK_PIN, OUTPUT);
    pinMode(SHIFT_REGISTER_LATCH_PIN, OUTPUT);
    pinMode(SHIFT_REGISTER_DATA_PIN, OUTPUT);
}