#ifndef ActuatorHandler_h
#define ActuatorHandler_h
#include "deviceInit.h"
#include <Servo.h>
#include <Arduino.h>
#include <Debug.h>

#define MODE_TEST_ON 0 // Test mode flag
#define CHANNEL_COUNT 3
// On the shift register we don't use Q0 for easier pcb planning
#define SR_RELAY1_ON B00000010 // Values for shift register to control relays (only 3 used)
#define SR_RELAY2_ON B00000100
#define SR_RELAY3_ON B00001000
#define SR_PROBLEM_LED_ON B00010000 // For the LED
#define SR_OFF B00000000

class ActuatorHandler {
private:
    uint8_t shiftRegisterState;
    Servo feederServo;
public:
    ActuatorHandler();
    ~ActuatorHandler();
    static bool* channelStates;
    /**
     * @brief Switches the provided channel to the given state
     * Switches the provided channel into the provided state if the channel isn't in that state already
     * @param channel
     * @param state
     */
    void channelSwithcer(const uint8_t& channel, const bool& state);
    void feed(const uint8_t& portions);
    void turnProblemLed(bool state);
};

#endif