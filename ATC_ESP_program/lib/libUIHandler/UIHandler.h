#ifndef UIHandler_h
#define UIHandler_h
#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <time.h>

class UIHandler {
private:
    static LiquidCrystal_I2C display;
    static UIHandler* instancePtr;
    UIHandler();

public:
    ~UIHandler();
    UIHandler(const UIHandler& ui) = delete;
    static UIHandler* getInstance();
    static void writeLine(const String& msg, const uint8_t& line, const uint8_t& col = 0);
    static void clearLine(const uint8_t line);
    static void writeBasicInfo(const time_t& now, const float& ph, const uint8_t& temp);
    static void clear();
};

#endif
