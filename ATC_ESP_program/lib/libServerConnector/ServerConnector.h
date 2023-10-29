#ifndef ServerConnector_h
#define ServerConnector_h
#include "UIHandler.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define CONN_TIMEOUT 60 // Connection timeout = timeout * 2 seconds
// (2 min should be enough after power outage for the wifi to reboot)

/**
 * This class is responsible for server communication
 */

class ServerConnector {
private:
    WiFiClient client;
    HTTPClient httpClient;
    static const String API_URL;
    static const String connectionCheckPath;
    static const String timePath;
    static const String sensorDataUploadPath;
    static const String notificationPath;

public:
    ServerConnector();
    /**
     * Connects to the WiFi network with the given credentials
     * and checks the connection with performing the request of the system ID
     * System ID can be given,
     * (in case the system already is in the database, and it has a saved id in the memory)
     *  in that case the check is dismissed (the ID must be given if the system has a saved ID)
     * @return The provided ID or the freshly generated one
     */
    uint16_t connectToNetwork(const String& ssid, const String& pass, const uint16_t& systemID = 0);
    void disconnect();
};

#endif // ! ServerConnector_h