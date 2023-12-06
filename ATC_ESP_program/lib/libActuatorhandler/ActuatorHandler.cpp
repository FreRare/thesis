#include <ActuatorHandler.h>

ActuatorHandler::ActuatorHandler()
{
    pinMode(RELAY_PIN, OUTPUT);
    this->channelStates = new bool[CHANNEL_COUNT];
    for (uint8_t i = 0; i < CHANNEL_COUNT; i++) {
        this->channelStates[i] = false;
    }
}

void ActuatorHandler::channelSwithcer(const uint8_t& channel, const bool& state)
{
    if (channel > 4 || channel == 0) {
        Serial.println("Invalid channel!");
        return;
    }
    // If the channel is already in the wanted state we have nothing to do
    if (this->channelStates[channel - 1] == state) {
        return;
    }
    // Decide which pin to write
    const uint8_t stateToWrite = state ? HIGH : LOW;
    switch (channel) {
    case 1:
        digitalWrite(CH1_PIN, stateToWrite);
        break;
    case 2:
        digitalWrite(CH2_PIN, stateToWrite);
        break;
    case 3:
        digitalWrite(CH3_PIN, stateToWrite);
        break;
    case 4:
        digitalWrite(CH4_PIN, stateToWrite);
        break;
    default:
        break;
    }
    // Set state to current
    this->channelStates[channel - 1] = state;
}