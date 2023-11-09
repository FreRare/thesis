#include "ActuatorHandler.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>

#define LAMP_RELAY_PIN D7

ServerConnector* server;
ActuatorHandler* actuatorHandler;
time_t espRtcTime;

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
    int h = hour();
    int min = minute();
    int sec = second();
    if (h == 0 && min == 0 && sec < 10 && sec > 0) { // At midnight sync time (10 sec interval)
        server->syncNTPTime();
    }
    if (h >= 8 && h <= 20 && !ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    } else if ((h < 8 || h > 20) && ActuatorHandler::isChannel1Active) {
        actuatorHandler->toggleChannel1();
    }
    Serial.printf("Internal RTC time: %02d:%02d\n", h, min);
    UIHandler::getInstance()->writeLine("Clock: " + String((h / 10 >= 1 ? h : '0' + String(h))) + ":"
            + String((min / 10 >= 1 ? min : '0' + String(min))),
        1);
    delay(5000);
}