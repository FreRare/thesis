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
    ActuatorHandler::isChannel1Active = false;
}

void loop()
{
    server->getTimeClient()->update();
    // This little logic should turn on relay at 8 and turn it off at 20
    int currentHours = server->getTimeClient()->getHours();
    int currentMins = server->getTimeClient()->getMinutes();
    int currentSecs = server->getTimeClient()->getSeconds();
    UIHandler::getInstance()->clear();
    UIHandler::getInstance()->writeLine("Clock " + String(currentHours) + ":" + String(currentMins) + ":" + currentSecs, 1);
    if (currentHours >= 8 && currentHours <= 20 && !ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    } else if ((currentHours > 20 || currentHours < 8) && ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    }
    delay(1000);
}