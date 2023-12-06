#ifndef ActuatorHandler_h
#define ActuatorHandler_h
#include "deviceInit.h"
#include <Arduino.h>

#define CHANNEL_COUNT 3
#define CH1_PIN D7 // D7
#define CH2_PIN D8 // D8
#define CH3_PIN D9 // RX
#define CH4_PIN D10 // TX - both can be used as digital GPIO //! WRITE ONLY

class ActuatorHandler {
private:
    bool* channelStates;

public:
    ActuatorHandler();
    ~ActuatorHandler();
    /**
     * @brief Switches the provided channel to the given state
     * Switches the provided channel into the provided state if the channel isn't in that state already
     * @param channel
     * @param state
     */
    void channelSwithcer(const uint8_t& channel, const bool& state);
};

#endif