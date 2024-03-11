#ifndef AQESPWifiConfig_h
#define AQESPWifiConfig_h
#include "ESP8266WebServer.h"
#include "MemoryHandler.h"
#include <Arduino.h>

//////////////////////////////////////////////////////////////////
// This class is managing the WiFi connection and the credentials for the network
// It performs the configuration of the nerwork
// Also it automatically handles if it cannot connect to the give network
//////////////////////////////////////////////////////////////////
class WiFiConfig {
private:
    static bool isConfigDoneFlag; // Flag to indicate if the wifi config is done
    String WIFI_SSID; // The wifi network's name
    String WIFI_PASS; // The password for the wifi network
    uint8_t systemID; // The system's ID
    static MemoryHandler* memHandler; // Memory handler
    static ESP8266WebServer* configServer; // The esp config webserver
    /**
     * @brief Creates a site to give WiFi credentials
     * Creates a basic html site what it'll display once the user connects to the esp's server
     */
    static void createSiteForWiFiLogin();
    /**
     * @brief Loads the wifi credentials from the memory
     * Uses the memHandler member to load the WiFi credentials stored in the memory
     */
    void loadCredentials();
    /**
     * @brief Saves the wifi credentials to the memory
     * Uses memHandler, to set the WiFi credentials to the memory after the user provided them
     * Uses the WIFI_SSID/WIFI_PASS members to determine the values to store
     */
    static void saveCredentials();

public:
    WiFiConfig();
    ~WiFiConfig();
    String getSSID();
    String getPassword();
    uint8_t getSystemID();
    /**
     * @brief Saves the provided ID to the memory for later access
     * Uses memHandler to save the provided ID to the esp's memory
     * @param id - The identification number to save
     */
    void saveSystemID(const uint16_t& id);
    /**
     * @brief Forgets the WiFi credentials
     * After calling the esp won't be able to connect to the network so the wifi network have to be configured again
     * Should be used in case of couldn't connect to network because of invalid credentials and for factory reset
     */
    void forgetNetwork();
    /**
     * @brief Starts the wifi config method
     * Initializes the wifi config procedure with creating the esp server and giving information about the to-do's through the LCD
     * @see createSiteForWiFiLogin
     * @see saveCredentials
     */
    void initializeNetwork();
};

#endif