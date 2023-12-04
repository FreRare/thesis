#ifndef ActuatorHandler_h
#define ActuatorHandler_h
#include "deviceInit.h"
#include <Arduino.h>

class ActuatorHandler {
public:
    ActuatorHandler();
    ~ActuatorHandler();
    void turnOnChannel1();
    void turnOffChannel1();
    void turnOnChannel2();
    void turnOffChannel2();
    void turnOnChannel3();
    void turnOffChannel3();
};

#endif