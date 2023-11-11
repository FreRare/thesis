#include "ActuatorHandler.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>

#define LAMP_RELAY_PIN D7

ServerConnector* server;
ActuatorHandler* actuatorHandler;
int h = 0;
int minutes = 0;

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
    UIHandler::getInstance()->clear();
}

void loop()
{
    h = hour();
    minutes = minute();
    // At midnight (10 sec interval) sync the NTP time to local
    if (h == 0) {
        int sec = second();
        if (minutes == 0 && sec < 10 && sec >= 0) {
            server->syncNTPTime();
        }
    }
    UIHandler::getInstance()->clearLine(1);
    UIHandler::getInstance()->writeLine("Clock " + String(h) + ":" + String(minutes), 1);
    // Handle relay 1
    Serial.println(
        "Hour: " + String(h) + "Relay is " + (ActuatorHandler::isChannel1Active ? "active" : "inactive") + ".");
    if (h >= 8 && h <= 20 && !ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    } else if ((h > 20 || h < 8) && ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    }
    delay(5000);
}