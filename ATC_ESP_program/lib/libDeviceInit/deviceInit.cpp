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
    pinMode(FEEDER_SERVO_PIN, OUTPUT);
}

void updateShiftRegister(uint8_t byteValue)
{
    digitalWrite(SHIFT_REGISTER_LATCH_PIN, LOW);
    shiftOut(SHIFT_REGISTER_DATA_PIN, SHIFT_REGISTER_CLK_PIN, MSBFIRST, byteValue);
    digitalWrite(SHIFT_REGISTER_LATCH_PIN, HIGH);
}

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
