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
#include <WiFiUdp.h>
#include <TimeLib.h>
#include <Timezone.h>
#include <stdio.h>

#define CONN_TIMEOUT 150 // Connection timeout = timeout * 2 seconds
// (2 min should be enough after power outage for the wifi to reboot)
#define SYSTEMID_TEXT_LENGTH 20 // The length of the string to display system id
#define CONFIG_UPDATE_POST_DATA_LENGTH 18 // The length of the str to send config update json
#define SESNOR_DATA_POST_LENGTH 116 // The length of the str to post sensor data
#define NOTIFICATION_DATA_LENGTH 36// Length of the notification data

#define NTP_SERVER_ADDRESS "pool.ntp.org"

#define URL_CONNECTION_CHECK "http://atc.takacsnet.hu/CONTROLS/aquarium/connectionCheck.php"
#define URL_SENSOR_DATA_UPLOAD "http://atc.takacsnet.hu/CONTROLS/aquarium/sensorDataUpload.php"
#define URL_NOTIFICATION "http://atc.takacsnet.hu/CONTROLS/notification/notificationHandler.php"
#define URL_CONFIG_UPDATE "http://atc.takacsnet.hu/CONTROLS/aquarium/getAquariumConfig.php"
#define URL_FACTORY_RESET_CHECK "http://atc.takacsnet.hu/CONTROLS/aquarium/factoryResetCheck.php"
#define URL_POST_LOG "http://atc.takacsnet.hu/LOG/Logger.php" 

/**
 * This class is responsible for server communication
 * Also handles Clock data from NTP server
 */
class ServerConnector {
private:
    WiFiClient client;
    HTTPClient httpClient;
    WiFiUDP udpClient;
    NTPClient *timeClient;
    WiFiConfig* config;
    Timezone* MYTZ;

    bool lowTempNotificationSent;
    bool highTempNotificationSent;
    bool lowPhNotificationSent;
    bool highPhNotificationSent;
    bool brokenLightNotificationSent;
    bool lowWaterNotificationSent;

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
    /**
     * @brief Logger function, the str parameter gets sent to the server's logger mechanism
     * !IMPORTANT! only status messages should include the ':' character or else the logger will append an OK status to the end of the log 
     * @param str The log message to be sent
     */
    void ATCLog(char* str);
    /**
     * Fetches the config data form the database
     * Checks if we had update or no
     * @return the new config or null
     */
    ConfigData* updateConfigData(ConfigData* config);
    /**
     * Posts the provided data to the database
     */
    bool postSensorData(const SensorData* data);
    /**
     * Sends a config status code to the API when a problem occurs
     */
    void postErrorCode(const ConfigStatus& status);
    /**
     * @brief Resets the notification flags
     * Some notifications should only be sent once a day so this function should be called along with NTP sync so it can reset the flags
     */
    void resetNotificationFlags();
    /**
     * Checks if the system's aquarium has been inactivated or no
     * If it is inactive resets the system to factory reset ->
     * Deletes all data from EEPROM and stands by unitl repower
     * After that keeps the system in reset state until manually rebooted
     */
    bool checkForFactoryReset();
};

#endif // ! ServerConnector_h