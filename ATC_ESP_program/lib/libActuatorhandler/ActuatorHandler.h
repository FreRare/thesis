#ifndef ActuatorHandler_h
#define ActuatorHandler_h
#include <Arduino.h>

#define RELAY_CHANNEL_1_PIN D7

/////////////////////////////////////////////////////
// This class is handling the relays and the feeder
/////////////////////////////////////////////////////

class ActuatorHandler {
public:
    static bool isChannel1Active;
    static bool isChannel2Active;
    static bool isChannel3Active;
    ActuatorHandler();
    ~ActuatorHandler();
    void toggleChannel1();
    void toggleChannel2();
    void toggleChannel3();
};

#endif