#ifndef ServerConnector_h
#define ServerConnector_h
#include "AQWiFiConfig.h"
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
    AQWiFiConfig* config;
    static const String API_URL;
    static const String connectionCheckPath;
    static const String timePath;
    static const String sensorDataUploadPath;
    static const String notificationPath;

public:
    /**
     * The constructor initializes the config member
     * and automatically calls the connectToNetwork function
     * to see if it's a valid network and is working properly
     */
    ServerConnector();
    ~ServerConnector();
    /**
     * Connects to the WiFi network configured in config member
     * and checks the connection with performing the request of the system ID.
     * If have a saved ID
     * (in case the system already is in the database, or it has a saved id in the memory)
     *  in that case the check is dismissed
     * @return The provided ID or the freshly generated one
     */
    bool connectToNetwork();
    void disconnect();
};

#endif // ! ServerConnector_h