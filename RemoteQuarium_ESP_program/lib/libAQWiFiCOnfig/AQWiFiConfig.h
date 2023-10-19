#ifndef AQESPWifiConfig_h
#define AQESPWifiConfig_h
#include "Arduino.h"
#include "ESP8266WiFi.h"
#include "ESP8266WebServer.h"
#include "MemoryHandler.h"

//////////////////////////////////////////////////////////////////
// This class is managing the WiFi connection and the credentials for the network
// It performs the configuration of the nerwork
// Also it automatically handles if it cannot connect to the give network
//////////////////////////////////////////////////////////////////
class AQWiFiConfig {
private:
  static bool isConfigDoneFlag;
  String WIFI_SSID;
  String WIFI_PASS;
  static MemoryHandler* memHandler;
  static ESP8266WebServer* configServer;
  static void createSiteForWiFiLogin();
  void loadCredentials();
  static void saveCredentials();
public:
  AQWiFiConfig();
  ~AQWiFiConfig(){};
  bool connectToNetwork();
  bool isConnected();
  String getWiFiStatus();
  void forgetNetwork();
  void initializeNetwork();
  ESP8266WebServer* getServer();
};

#endif