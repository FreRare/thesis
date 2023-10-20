#include "AQWiFiConfig.h"
#include "Arduino.h"
#include "ESP8266WebServer.h"
#include "ESP8266WiFi.h"
#include "Esp.h"
#include "MemoryHandler.h"

#define CONN_TIMEOUT 30 // Connection timeout = timeout * 2 seconds

ESP8266WebServer* AQWiFiConfig::configServer = new ESP8266WebServer(80);
MemoryHandler* AQWiFiConfig::memHandler = MemoryHandler::getInstance();
bool AQWiFiConfig::isConfigDoneFlag = false;

AQWiFiConfig::AQWiFiConfig()
{
    this->WIFI_SSID = "";
    this->WIFI_PASS = "";
    // Try to load credentials when initializing object
    this->loadCredentials();
    // If creds are loaded
    if (this->WIFI_SSID.length() > 0 && this->WIFI_PASS.length() > 0) {
        isConfigDoneFlag = true;
        DEBUG_PRINT("Credential loaded successfully!");
    } else {
        DEBUG_PRINT("No credentials found.. Please add a wifi network");
        this->initializeNetwork();
    }
    // Wait until config is done
    while (!isConfigDoneFlag) {
        DEBUG_PRINT("Wifi config in progress");
        AQWiFiConfig::configServer->handleClient();
        delay(1000);
    }
    DEBUG_PRINT("Wifi config completed!");
}

ESP8266WebServer* AQWiFiConfig::getServer() { return AQWiFiConfig::configServer; }

// Tries to connect to a network with the given credentials
//  Returns true when successful
bool AQWiFiConfig::connectToNetwork()
{
    // Start connection
    WiFi.begin(this->WIFI_SSID, this->WIFI_PASS);
    int connectionTimeout = 0;
    while (WiFi.status() != WL_CONNECTED) {
        DEBUG_PRINT("WiFi connecting...");
        // When we reach timeout reset the ESP and try to get credentials again
        if (connectionTimeout == CONN_TIMEOUT) {
            DEBUG_PRINT("Connection timed out!");
            DEBUG_PRINT("The device will forget the network and try to get access again...");
            // Forgetting network than restarting the device
            this->forgetNetwork();
            DEBUG_PRINT("Resetting...");
            ESP.restart();
        }
        delay(2000);
        connectionTimeout++;
    }
    DEBUG_PRINT("WiFi connected!");
    return true;
}

// Saves the credentials to the memory (starts at 0 address)
// If called without args it's from the config server
void AQWiFiConfig::saveCredentials()
{
    // Config server save
    String newSSID = AQWiFiConfig::configServer->arg("ssid");
    String newPassword = AQWiFiConfig::configServer->arg("password");
    // if we have credentials proceed
    if (newSSID.length() > 0 && newPassword.length() > 0) {
        DEBUG_PRINT("SSID: " + newSSID + " -- " + "Pass: " + newPassword);
        // Write them to memory
        AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->wifiConfigDataStartAddress;
        AQWiFiConfig::memHandler->writeWord(newSSID);
        AQWiFiConfig::memHandler->actualAddress++;
        AQWiFiConfig::memHandler->writeWord(newPassword);
        // Sending confirm message to the server
        String html = "<html><body><h1>Settings saved. Restarting...</h1></body></html>";
        AQWiFiConfig::configServer->send(200, "text/html", html);
        DEBUG_PRINT("Wifi config is saved! Restarting...");
        AQWiFiConfig::isConfigDoneFlag = true;
        // Restarting
        delay(100);
        ESP.restart();
    }
}

// Loads the credentials from the memory to the class members
void AQWiFiConfig::loadCredentials()
{
    DEBUG_PRINT("Loading configuration from the EEPROM...");
    // reading data from memory
    AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->wifiConfigDataStartAddress;
    this->WIFI_SSID = AQWiFiConfig::memHandler->readWord();
    DEBUG_PRINT("Read ssid: " + WIFI_SSID);
    // Increment address with the length of str
    AQWiFiConfig::memHandler->actualAddress++;
    this->WIFI_PASS = AQWiFiConfig::memHandler->readWord();
    DEBUG_PRINT("Read pass: " + WIFI_PASS);
}

void AQWiFiConfig::initializeNetwork()
{
    WiFi.mode(WIFI_AP);
    WiFi.softAP("ConfigPortal", "");
    IPAddress serverIP = WiFi.softAPIP();
    DEBUG_PRINT("Ap IP is: ");
    DEBUG_PRINT(serverIP);

    // Config webpage
    AQWiFiConfig::configServer->on("/", HTTP_GET, AQWiFiConfig::createSiteForWiFiLogin);
    AQWiFiConfig::configServer->on("/save", HTTP_POST, AQWiFiConfig::saveCredentials);
    AQWiFiConfig::configServer->begin();
}

// Creates a simple login page
void AQWiFiConfig::createSiteForWiFiLogin()
{
    String html = "<html><body>";
    html += "<h1>WiFi Configuration</h1>";
    html += "<form action='/save' method='post'>";
    html += "SSID: <input type='text' name='ssid' value=''><br>";
    html += "Password: <input type='password' name='password' value=''><br>";
    html += "<input type='submit' value='Save'>";
    html += "</form></body></html>";

    AQWiFiConfig::configServer->send(200, "text/html", html);
}

// Clears the credentials
void AQWiFiConfig::forgetNetwork()
{
    AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->wifiConfigDataStartAddress;
    AQWiFiConfig::memHandler->clearMemory(
        this->memHandler->wifiConfigDataStartAddress, this->WIFI_SSID.length() + this->WIFI_PASS.length());
    DEBUG_PRINT("Network credentials deleted!");
}