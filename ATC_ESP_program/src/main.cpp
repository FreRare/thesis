#include "AQWiFiConfig.h"
#include "MemoryHandler.h"
#include "ServerConnector.h"
#include <Arduino.h>

const ServerConnector* server = new ServerConnector();

void setup() { Serial.begin(9600); }

void loop() { }