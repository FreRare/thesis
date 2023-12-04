#ifndef ServerConnector_h
#define ServerConnector_h
#include "AQWiFiConfig.h"
#include "ConfigStatus.h"
#include "SensorData.h"
#include "UIHandler.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <TimeLib.h>
#include <WiFiUdp.h>
#include <stdio.h>

#define CONN_TIMEOUT 60 // Connection timeout = timeout * 2 seconds
// (2 min should be enough after power outage for the wifi to reboot)
#define SYSTEMID_TEXT_LENGTH 20
#define CONFIG_UPDATE_POST_DATA_LENGTH 7
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
    static const char* configUpdatePath;

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
     */
    bool connectToNetwork();
    /**
     * Syncs the locale RTC with the NTP server
     */
    void syncNTPTime();
    void disconnect();
    NTPClient* getTimeClient() const;
    /**
     * Fetches the config data form the database
     * Checks if we had update or no
     * @return the new config or null
     */
    ConfigData* updateConfigData();
    /**
     * Posts the provided data to the database
     */
    void postSensorData(const SensorData& data);
    /**
     * Sends a config status code to the API when a problem occurs
     */
    void postErrorCode(const ConfigStatus& status);
    /**
     * Checks if the system's aquarium has been inactivated or no
     * If it is inactive resets the system to factory reset ->
     * Deletes all data from EEPROM and stands by unitl repower
     * @return If the reset was successful
     */
    bool checkForReset();
};

#endif // ! ServerConnector_h