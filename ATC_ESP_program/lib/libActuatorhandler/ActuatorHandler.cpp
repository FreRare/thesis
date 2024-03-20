#include <ActuatorHandler.h>

bool* ActuatorHandler::channelStates = new bool[CHANNEL_COUNT];

ActuatorHandler::ActuatorHandler()
{
    for (uint8_t i = 0; i < CHANNEL_COUNT; i++) {
        ActuatorHandler::channelStates[i] = false;
    }
    this->shiftRegisterState = SR_OFF;
    updateShiftRegister(this->shiftRegisterState);
    /*this->feederServo.attach(FEEDER_SERVO_PIN);
    this->feederServo.write(0);
    Serial.println("TESTING SERVO...");
    
    for(int i = 0; i < 5;i++){
        this->feederServo.write(0);
        Serial.println("WROTE 0");
        delay(1000);
        this->feederServo.write(360);
        Serial.println("WROTE 180");
        delay(1000);
    }
    this->feederServo.write(0); 
    */
}

ActuatorHandler::~ActuatorHandler()
{
    delete[] channelStates;
    channelStates = nullptr;
}

void ActuatorHandler::channelSwithcer(const uint8_t& channel, const bool& state)
{
    if (channel > 3 || channel == 0) {
        Serial.println("Invalid channel!");
        turnProblemLed(true);
        return;
    }
    // If the channel is already in the wanted state we have nothing to do
    if (ActuatorHandler::channelStates[channel - 1] == state) {
        return;
    }
    // Decide which pin to write
    switch (channel) {
    case 1:
        state ? this->shiftRegisterState |= SR_RELAY1_ON : this->shiftRegisterState &= ~SR_RELAY1_ON;
        break;
    case 2:
        state ? this->shiftRegisterState |= SR_RELAY2_ON : this->shiftRegisterState &= ~SR_RELAY2_ON;
        break;
    case 3:
        state ? this->shiftRegisterState |= SR_RELAY3_ON : this->shiftRegisterState &= ~SR_RELAY3_ON;
        break;
    }
    // Set state to current
    ActuatorHandler::channelStates[channel - 1] = state;
    updateShiftRegister(this->shiftRegisterState);
}

void ActuatorHandler::feed(const uint8_t& portions)
{
    // TODO: FEED
}

void ActuatorHandler::turnProblemLed(bool state)
{
    state ? this->shiftRegisterState |= SR_PROBLEM_LED_ON : this->shiftRegisterState &= ~SR_PROBLEM_LED_ON;
    Serial.println("Switching red LED");
    updateShiftRegister(this->shiftRegisterState);
}