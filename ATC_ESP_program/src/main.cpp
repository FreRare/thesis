#include "AQWiFiConfig.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>

void setup() {
    Serial.begin(9600);
    const ServerConnector* server = new ServerConnector();
    // !MemoryHandler::getInstance()->clearMemory(0, 512); 
    }

void loop() { }