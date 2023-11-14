#include "ActuatorHandler.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>
#include <stdio.h>

#define LAMP_RELAY_PIN D7

ServerConnector* g_server;
ActuatorHandler* g_actuatorHandler;

void coorigateDigits(int h, int min, char str[6])
{
    if (h > 9 && min > 9) {
        sprintf(str, "%2d:%2d", h, min);
    } else if (h > 9) {
        sprintf(str, "%2d:0%1d", h, min);
    } else if (min > 9) {
        sprintf(str, "0%1d:%2d", h, min);
    } else {
        sprintf(str, "0%1d:0%1d", h, min);
    }
}

void setup()
{
    Serial.begin(9600);
    while (!Serial)
        ;
    // !MemoryHandler::getInstance()->clearMemory(0, 512);
    g_server = new ServerConnector();
    g_actuatorHandler = new ActuatorHandler();
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
        g_server->syncNTPTime();
    }
    if (h >= 8 && h <= 20 && !ActuatorHandler::isChannel1Active) {
        g_actuatorHandler->toggleChannel1();
    } else if ((h < 8 || h > 20) && ActuatorHandler::isChannel1Active) {
        g_actuatorHandler->toggleChannel1();
    }
    char clockStr[6];
    coorigateDigits(h, min, clockStr);
    UIHandler::getInstance()->writeLine("Clock: ", 1);
    UIHandler::getInstance()->writeLine(clockStr, 2, 3);
    delay(5000);
}