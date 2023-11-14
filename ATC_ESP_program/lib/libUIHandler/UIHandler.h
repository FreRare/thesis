#ifndef UIHandler_h
#define UIHandler_h
#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <time.h>

#define LCD_ADDRESS 0x27
#define LCD_ROWS 4
#define LCD_COLUMNS 20
#define SSID_TEXT_LENGTH 6
#define IP_TEXT_LENGTH 4

class UIHandler {
private:
    static LiquidCrystal_I2C display;
    static UIHandler* instancePtr;
    bool enableScrollingText;
    UIHandler();

public:
    ~UIHandler();
    UIHandler(const UIHandler& ui) = delete;
    static UIHandler* getInstance();
    static void makeWiFiConfigMessage(const char* ssid, const char* ip);
    static void makeScrollingText(
<<<<<<< HEAD
        const String& msg, const uint8_t line, const uint16_t& delayTime = 400, const uint8_t& cycles = 1);
    static void disableScrollingText();
    static void writeLine(const String& msg, const uint8_t& line, const uint8_t& col = 0);
    static void clearLine(const uint8_t& line);
=======
        const char* msg, const uint8_t line, const uint16_t& delayTime = 400, const uint8_t& cycles = 1);
    static void writeLine(const char* msg, const uint8_t& line, const uint8_t& col = 0);
    static void clearLine(const uint8_t line);
>>>>>>> main
    static void writeBasicInfo(const time_t& now, const float& ph, const uint8_t& temp);
    static void clear();
};

#endif
