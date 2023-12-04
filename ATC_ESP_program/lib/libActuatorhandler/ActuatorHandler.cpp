#include <ActuatorHandler.h>

ActuatorHandler::ActuatorHandler() { pinMode(RELAY_PIN, OUTPUT); }

void ActuatorHandler::turnOnChannel1() { digitalWrite(RELAY_PIN, HIGH); }
void ActuatorHandler::turnOffChannel1() { digitalWrite(RELAY_PIN, LOW); }
void ActuatorHandler::turnOnChannel2() { digitalWrite(RELAY_PIN, LOW); }
void ActuatorHandler::turnOffChannel2() { digitalWrite(RELAY_PIN, LOW); }
void ActuatorHandler::turnOnChannel3() { digitalWrite(RELAY_PIN, LOW); }
void ActuatorHandler::turnOffChannel3() { digitalWrite(RELAY_PIN, LOW); }