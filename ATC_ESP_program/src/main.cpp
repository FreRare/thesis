#include "ActuatorHandler.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>
#include <Time.h>

#define LAMP_RELAY_PIN D7

ServerConnector* server;
ActuatorHandler* actuatorHandler;
String formattedTime = "";
time_t epochTime;

void setup()
{
    Serial.begin(9600);
    while (!Serial)
        ;
    // !MemoryHandler::getInstance()->clearMemory(0, 512);
    server = new ServerConnector();
    actuatorHandler = new ActuatorHandler();
    pinMode(LAMP_RELAY_PIN, OUTPUT);
}

void loop()
{
    server->getTimeClient()->update();
    // This little logic should turn on relay at 8 and turn it off at 20
    int currentHours = server->getTimeClient()->getHours();
    if (currentHours >= 8 && !ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    } else if (currentHours >= 20 && ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    }
}