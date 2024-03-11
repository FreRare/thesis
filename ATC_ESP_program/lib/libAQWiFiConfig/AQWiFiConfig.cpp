#include "AQWiFiConfig.h"
#include "Arduino.h"
#include "ESP8266WebServer.h"
#include "ESP8266WiFi.h"
#include "Esp.h"
#include "MemoryHandler.h"
#include <UIHandler.h>

ESP8266WebServer* WiFiConfig::configServer = new ESP8266WebServer(80);
MemoryHandler* WiFiConfig::memHandler = MemoryHandler::getInstance();
bool WiFiConfig::isConfigDoneFlag = false;

WiFiConfig::WiFiConfig()
{
    this->WIFI_SSID = "";
    this->WIFI_PASS = "";
    // Try to load credentials when initializing object
    this->loadCredentials();
    // If creds are loaded
    if (this->WIFI_SSID.length() > 0 && this->WIFI_PASS.length() > 0) {
        isConfigDoneFlag = true;
        UIHandler::getInstance()->writeLine("Successful", 1);
        UIHandler::getInstance()->writeLine("configuration!", 2, 5);
    } else {
        this->initializeNetwork();
    }
    // Wait until config is done
    while (!isConfigDoneFlag) {
        DEBUG_PRINTLN("Wifi config in progress...");
        WiFiConfig::configServer->handleClient();
        delay(1000);
    }
}

WiFiConfig::~WiFiConfig()
{
    delete this->memHandler;
    delete this->configServer;
}

String WiFiConfig::getSSID() { return this->WIFI_SSID; }
String WiFiConfig::getPassword() { return this->WIFI_PASS; }
uint8_t WiFiConfig::getSystemID() { return this->systemID; }

void WiFiConfig::saveSystemID(const uint16_t& id)
{
    this->systemID = id;
    WiFiConfig::memHandler->actualAddress = WiFiConfig::memHandler->systemIdentificationNumberAddress;
    WiFiConfig::memHandler->writeInt(id);
}

// Saves the credentials to the memory (starts at 0 address)
// If called without args it's from the config server
void WiFiConfig::saveCredentials()
{
    // Config server save
    String newSSID = WiFiConfig::configServer->arg("ssid");
    String newPassword = WiFiConfig::configServer->arg("password");
    // if we have credentials proceed
    if (newSSID.length() > 0 && newPassword.length() > 0) {
        DEBUG_PRINTLN("SSID: " + newSSID + " -- " + "Pass: " + newPassword);
        // Write them to memory
        WiFiConfig::memHandler->actualAddress = WiFiConfig::memHandler->wifiConfigDataStartAddress;
        WiFiConfig::memHandler->writeWord(newSSID);
        WiFiConfig::memHandler->writeWord(newPassword);
        // Sending confirm message to the server
        String html = "<html><body><h1>Settings saved. Restarting...</h1></body></html>";
        WiFiConfig::configServer->send(200, "text/html", html);
        DEBUG_PRINTLN("Wifi config is saved! Restarting...");
        WiFiConfig::isConfigDoneFlag = true;
        // Restarting
        delay(100);
        ESP.restart();
    }
}

// Loads the credentials from the memory to the class members
void WiFiConfig::loadCredentials()
{
    DEBUG_PRINTLN("Loading configuration from the EEPROM...");
    // reading data from memory
    WiFiConfig::memHandler->actualAddress = WiFiConfig::memHandler->wifiConfigDataStartAddress;
    this->WIFI_SSID = WiFiConfig::memHandler->readWord();
    DEBUG_PRINTLN("Read ssid: " + this->WIFI_SSID);
    // Increment address with the length of str
    this->WIFI_PASS = WiFiConfig::memHandler->readWord();
    DEBUG_PRINTLN("Read pass: " + this->WIFI_PASS);
    WiFiConfig::memHandler->actualAddress = WiFiConfig::memHandler->systemIdentificationNumberAddress;
    this->systemID = WiFiConfig::memHandler->readInt(); // System ID is 0 if not saved before
    DEBUG_PRINTLN("SYSTEM ID: " + String(this->systemID));
}

void WiFiConfig::initializeNetwork()
{
    const char SSID[] = "ATC_portal";
    WiFi.mode(WIFI_AP);
    WiFi.softAP(SSID, "");
    IPAddress serverIP = WiFi.softAPIP();
    uint16_t ipLength = serverIP.toString().length();
    char serverIpAsCharArray[ipLength];
    strcpy(serverIpAsCharArray, serverIP.toString().c_str());
    UIHandler::getInstance()->makeWiFiConfigMessage(SSID, serverIpAsCharArray);

    // Config webpage
    WiFiConfig::configServer->on("/", HTTP_GET, WiFiConfig::createSiteForWiFiLogin);
    WiFiConfig::configServer->on("/save", HTTP_POST, WiFiConfig::saveCredentials);
    WiFiConfig::configServer->begin();
}

void WiFiConfig::createSiteForWiFiLogin()
{
    String html = "<html><body>";
    html += "<h1>WiFi Configuration</h1>";
    html += "<form style='margin: 3%;' action='/save' method='post'>";
    html += "SSID: <input style='margin: 3%;' type='text' name='ssid' value=''><br>";
    html += "Password: <input type='password' name='password' value=''><br>";
    html += "<input type='submit' value='Save'>";
    html += "</form></body></html>";

    WiFiConfig::configServer->send(200, "text/html", html);
}

// Clears the credentials
void WiFiConfig::forgetNetwork()
{
    WiFiConfig::memHandler->actualAddress = WiFiConfig::memHandler->wifiConfigDataStartAddress;
    WiFiConfig::memHandler->clearMemory(
        this->memHandler->wifiConfigDataStartAddress, this->memHandler->configDataStartAddress);
    DEBUG_PRINTLN("Network credentials deleted!");
}