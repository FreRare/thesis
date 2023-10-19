#ifndef AQESPWifiConfig_h
#define AQESPWifiConfig_h
#include "Arduino.h"
#include "ESP8266WiFi.h"
#include "ESP8266WebServer.h"
#include "MemoryHandler.h"

// Only for WiFi configurations
// It can perform the initializational connection saving too
class AQWiFiConfig {
public:
  // Constructor
  AQWiFiConfig();
  ~AQWiFiConfig(){};
  // Methods
  // Tries to connect to a network, if timeout it executes forgetnetwork
  bool connectToNetwork();
  // Returns true if connected to a network
  bool isConnected();
  // Returns the wifi connection status as a string
  String getWiFiStatus();
  // Forgets the network (deletes it from the memory and reboots)
  void forgetNetwork();
  // Opens a login server and collects the user input for the wifi credentials
  void initializeNetwork();
  ESP8266WebServer* getServer();
private:
  // Members
  static bool isConfigDoneFlag;
  String WIFI_SSID;
  String WIFI_PASS;
  static MemoryHandler* memHandler;
    // Configuration server 
  static ESP8266WebServer* configServer;
  // Methods
  static void createSiteForWiFiLogin();
  // Reads data from eeprom (ssid and password)
  // Writes them to the data members
  void loadCredentials();
  // Saves the credentials to the eeprom
  static void saveCredentials();
};

#endif