#include "MemoryHandler.h"
#include <AQWiFiConfig.h>
#include <Arduino.h>
#include <ESP8266HTTPClient.h>

#define URL "https://abel.takacsnet.hu"

void setup()
{
    Serial.begin(9600);
    // MemoryHandler::getInstance()->clearMemory(0, 512);
    AQWiFiConfig* config = new AQWiFiConfig();
    HTTPClient http;
    config->connectToNetwork();
    WiFiClient client;
    http.begin(client, "https://abel.takacsnet.hu:80");

    int httpCode = http.GET();
    if (httpCode > 0) {
        Serial.println("Http code: " + httpCode);
        if (httpCode == HTTP_CODE_OK) {
            String payload = http.getString();
            Serial.println(payload);
        }
    } else {
        Serial.println("Http failed");
    }
    http.end();
}

void loop() { }