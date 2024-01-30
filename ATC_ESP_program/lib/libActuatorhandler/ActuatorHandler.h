#ifndef ActuatorHandler_h
#define ActuatorHandler_h
#include "deviceInit.h"
#include <Arduino.h>
#include <Debug.h>

#define CHANNEL_COUNT 3
// On the shift register we don't use Q0 for easier pcb planning
#define SR_RELAY1_ON B00000010 // Values for shift register to control relays (only 3 used)
#define SR_RELAY2_ON B00000100
#define SR_RELAY3_ON B00001000
#define SR_RELAY4_ON B00010000
#define SR_FEEDER_ON B00100000 // For the feeder motor
#define SR_PROBLEM_LED_ON B01000000 // For the LED
#define SR_OFF B00000000

class ActuatorHandler {
public:
    ActuatorHandler();
    ~ActuatorHandler();
    static bool* channelStates;
    uint8_t shiftRegisterState;
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