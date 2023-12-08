#ifndef ActuatorHandler_h
#define ActuatorHandler_h
#include "deviceInit.h"
#include <Arduino.h>

#define CHANNEL_COUNT 3

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
    void feed(const uint8_t& portions);
};

#endif