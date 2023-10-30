#include "AQWiFiConfig.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>

void setup()
{
    Serial.begin(9600);
    ServerConnector* server = new ServerConnector();
}

void loop() { }