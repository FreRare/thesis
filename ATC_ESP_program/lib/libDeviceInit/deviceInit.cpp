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
    char binaryString[9];
    sprintf(binaryString, "%c%c%c%c%c%c%c%c", (byteValue & 0x80) ? '1' : '0', (byteValue & 0x40) ? '1' : '0',
        (byteValue & 0x20) ? '1' : '0', (byteValue & 0x10) ? '1' : '0', (byteValue & 0x08) ? '1' : '0',
        (byteValue & 0x04) ? '1' : '0', (byteValue & 0x02) ? '1' : '0', (byteValue & 0x01) ? '1' : '0');
    binaryString[8] = '\0';

    char* msg = new char[34];
    sprintf(msg, "Updating shift register: %s", binaryString);
    Serial.println(msg);
    delete[] msg;
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
