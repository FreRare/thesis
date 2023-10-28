#ifndef UIHandler_h
#define UIHandler_h
#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <time.h>

class UIHandler {
private:
    const static uint8_t lcdColumns = 20;
    const static uint8_t lcdRows = 4;
    static LiquidCrystal_I2C display;

public:
    UIHandler();
    void writeLine(const String& msg, const uint8_t& line);
    void clearLine(const uint8_t line);
    void writeBasicInfo(const time_t& now, const float& ph, const uint8_t& temp);
    void clear();
};

#endif
