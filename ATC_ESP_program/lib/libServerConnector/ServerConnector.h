#ifndef ServerConnector_h
#define ServerConnector_h
#include "AQWiFiConfig.h"
#include "ConfigData.h"
#include "UIHandler.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <TimeLib.h>
#include <WiFiUdp.h>

#define CONN_TIMEOUT 60 // Connection timeout = timeout * 2 seconds
// (2 min should be enough after power outage for the wifi to reboot)
#define SYSTEMID_TEXT_LENGTH 20
#define NTP_SERVER_ADDRESS "pool.ntp.org"

/**
 * This class is responsible for server communication
 * Also handles Clock data from NTP server
 */
class ServerConnector {
private:
    WiFiClient client;
    HTTPClient httpClient;
    WiFiUDP ntpUDP;
    NTPClient* timeClient;
    AQWiFiConfig* config;
    static const char* API_URL;
    static const char* connectionCheckPath;
    static const char* timePath;
    static const char* sensorDataUploadPath;
    static const char* notificationPath;

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
    /**
     * Syncs the locale RTC with the NTP server
     */
    void syncNTPTime();
    void disconnect();
    NTPClient* getTimeClient() const;
};

#endif // ! ServerConnector_h