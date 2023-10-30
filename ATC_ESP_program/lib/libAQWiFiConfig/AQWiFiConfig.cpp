#include "AQWiFiConfig.h"
#include "Arduino.h"
#include "ESP8266WebServer.h"
#include "ESP8266WiFi.h"
#include "Esp.h"
#include "MemoryHandler.h"
#include <UIHandler.h>

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
        UIHandler::getInstance()->writeLine("Successful", 1);
        UIHandler::getInstance()->writeLine("configuration!", 2);
    } else {
        this->initializeNetwork();
    }
    // Wait until config is done
    while (!isConfigDoneFlag) {
        Serial.println("Wifi config in progress...");
        AQWiFiConfig::configServer->handleClient();
        delay(1000);
    }
}

String AQWiFiConfig::getSSID() { return this->WIFI_SSID; }
String AQWiFiConfig::getPassword() { return this->WIFI_PASS; }
uint16_t AQWiFiConfig::getSystemID() { return this->systemID; }
void AQWiFiConfig::saveSystemID(const uint16_t& id)
{
    this->systemID = id;
    AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->systemIdentificationNumberAddress;
    AQWiFiConfig::memHandler->writeInt(id);
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
        Serial.println("SSID: " + newSSID + " -- " + "Pass: " + newPassword);
        // Write them to memory
        AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->wifiConfigDataStartAddress;
        AQWiFiConfig::memHandler->writeWord(newSSID);
        AQWiFiConfig::memHandler->writeWord(newPassword);
        // Sending confirm message to the server
        String html = "<html><body><h1>Settings saved. Restarting...</h1></body></html>";
        AQWiFiConfig::configServer->send(200, "text/html", html);
        Serial.println("Wifi config is saved! Restarting...");
        AQWiFiConfig::isConfigDoneFlag = true;
        // Restarting
        delay(100);
        ESP.restart();
    }
}

// Loads the credentials from the memory to the class members
void AQWiFiConfig::loadCredentials()
{
    Serial.println("Loading configuration from the EEPROM...");
    // reading data from memory
    AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->wifiConfigDataStartAddress;
    this->WIFI_SSID = AQWiFiConfig::memHandler->readWord();
    Serial.println("Read ssid: " + this->WIFI_SSID);
    // Increment address with the length of str
    this->WIFI_PASS = AQWiFiConfig::memHandler->readWord();
    Serial.println("Read pass: " + this->WIFI_PASS);
    AQWiFiConfig::memHandler->actualAddress = AQWiFiConfig::memHandler->systemIdentificationNumberAddress;
    this->systemID = AQWiFiConfig::memHandler->readInt(); // System ID is 0 if not saved before
    Serial.println("SYSTEM ID: " + String(this->systemID));
}

void AQWiFiConfig::initializeNetwork()
{
    String SSID = "ATC_portal";
    WiFi.mode(WIFI_AP);
    WiFi.softAP(SSID, "");
    IPAddress serverIP = WiFi.softAPIP();
    UIHandler::getInstance()->makeWiFiConfigMessage(SSID, serverIP.toString());

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
    html += "<form style='margin: 3%;' action='/save' method='post'>";
    html += "SSID: <input style='margin: 3%;' type='text' name='ssid' value=''><br>";
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
        this->memHandler->wifiConfigDataStartAddress, this->memHandler->configDataStartAddress);
    Serial.println("Network credentials deleted!");
}