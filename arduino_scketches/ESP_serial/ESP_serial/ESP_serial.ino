#include <SoftwareSerial.h>
#include <string.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "AQWifiConfig.h"

////////////////////////////////////////////////////////////////////////////////
// Pin and setup configurations
///////////////////////////////////////////////////////////////////////////////

// Pins for serial communication
SoftwareSerial ESP_serial_to_Arduino(5, 4);  // RX = D1, TX = D2

// Data from arduino
String res = "";

AQWiFiConfig* aqWifi = NULL;

//////////////////////////////////////////////////////////////////////////////////
// Network configurations
/////////////////////////////////////////////////////////////////////////////////

// WIFI config
const String WIFI_SSID = "Silence of the LAN - 2.4GHz";
const String WIFI_PASS = "Korm()s0127";
// API access, give access point name here, PORT is important
const String SERVER_PATH = "https://abel.takacsnet.hu:80/index.html";

///////////////////////////////////////////////////////////////////////////////////
// SETUP starts here
///////////////////////////////////////////////////////////////////////////////////

void setup() {
  Serial.begin(9600);
  ESP_serial_to_Arduino.begin(9600);
  aqWifi = new AQWiFiConfig();
  aqWifi->connectToNetwork();
  delay(3000);
}

////////////////////////////////////////////////////////////////////////////////////////
// LOOP starts here
////////////////////////////////////////////////////////////////////////////////////////

void loop() {

  // Checking if the wifi is connected
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;  // WIFI
    HTTPClient http;    // HTTP
    // Starting http conn
    http.begin(client, SERVER_PATH.c_str());
    // GET
    int responseCode = http.GET();

    if (responseCode > 0) {
      // If success
      Serial.print("Http response code: ");
      Serial.println(responseCode);
      String payload = http.getString();
      Serial.println(payload);
    } else {
      // If error
      Serial.print("Error:");
      Serial.println(responseCode);
    }

    // End connection
    http.end();
  } else {
    Serial.println("WiFi disconnected!");
  }
  delay(5000);
}