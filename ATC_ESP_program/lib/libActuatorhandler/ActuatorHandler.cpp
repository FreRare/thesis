#include <ActuatorHandler.h>

bool* ActuatorHandler::channelStates = new bool[CHANNEL_COUNT];

ActuatorHandler::ActuatorHandler()
{
    for (uint8_t i = 0; i < CHANNEL_COUNT; i++) {
        ActuatorHandler::channelStates[i] = false;
    }
    this->feederServo.attach(FEEDER_SERVO_PIN, 500, 2400);
    this->feederServo.write(90);

    #if MODE_TEST_ON == 1
    
    Serial.println("Testing relays...");
    this->channelSwithcer(1, true);
    delay(2000);
    this->channelSwithcer(2, true);
    delay(2000);
    this->channelSwithcer(3, true);
    delay(2000);
    this->channelSwithcer(1, false);
    delay(2000);
    this->channelSwithcer(2, false);
    delay(2000);
    this->channelSwithcer(3, false);
    delay(2000);
    Serial.println("Relay test finished!");

    Serial.println("Testing feeder...");
    this->feed(3);
    Serial.println("Feeder test finished!");

    Serial.println("Testing problem LED");
    for(int i = 0; i<5;i++){
        this->turnProblemLed(true);
        delay(3000);
        this->turnProblemLed(false);
        delay(3000);
    }
    Serial.println("LED test finished!");

    #endif

    this->shiftRegisterState = SR_OFF;
    updateShiftRegister(this->shiftRegisterState);
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
    delay(100);
}

void ActuatorHandler::feed(const uint8_t& portions)
{
    for(uint8_t r = 0; r < portions; r++){

        this->feederServo.write(135);
        delay(100);
        this->feederServo.write(100);
        for(uint8_t i = 100; i > 0; i--){
            this->feederServo.write(i);
            delay(1);
        }
        delay(1000);
        for(uint8_t i = 1; i <= 90; i++){
            this->feederServo.write(i);
            delay(1);
        }

        /*for(uint8_t i = 90; i < 134; i++){
            this->feederServo.write(i);
            delay(1);
        }

        for(uint8_t i = 135; i > 0; i--){
            this->feederServo.write(i);
            delay(1);
        }

        for(uint8_t i = 0; i < 90; i++){
            this->feederServo.write(i);
            delay(1);
        }*/
        delay(1000);
    }
}

void ActuatorHandler::turnProblemLed(bool state)
{
    if((state && ((this->shiftRegisterState & SR_PROBLEM_LED_ON) == 0)) || (!state && ((this->shiftRegisterState & SR_PROBLEM_LED_ON) == 1))){
        return;
    }
    this->shiftRegisterState ^= SR_PROBLEM_LED_ON;
    Serial.print("Switching red LED with binary: ");
    Serial.println(this->shiftRegisterState, BIN);
    updateShiftRegister(this->shiftRegisterState);
}