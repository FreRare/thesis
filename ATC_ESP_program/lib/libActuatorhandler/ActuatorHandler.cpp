#include <ActuatorHandler.h>

bool ActuatorHandler::isChannel1Active = false;
bool ActuatorHandler::isChannel2Active = false;
bool ActuatorHandler::isChannel3Active = false;

ActuatorHandler::ActuatorHandler() { pinMode(RELAY_CHANNEL_1_PIN, OUTPUT); }

void ActuatorHandler::toggleChannel1() { ActuatorHandler::isChannel1Active = !ActuatorHandler::isChannel1Active; }
void ActuatorHandler::toggleChannel2() { ActuatorHandler::isChannel2Active = !ActuatorHandler::isChannel2Active; }
void ActuatorHandler::toggleChannel3() { ActuatorHandler::isChannel3Active = !ActuatorHandler::isChannel3Active; }