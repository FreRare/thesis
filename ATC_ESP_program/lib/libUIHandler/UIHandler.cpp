#include <UIHandler.h>

LiquidCrystal_I2C UIHandler::display = LiquidCrystal_I2C(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);
UIHandler* UIHandler::instancePtr = new UIHandler();

UIHandler::UIHandler()
{
    this->enableScrollingText = false;
    UIHandler::display.init();
    UIHandler::display.backlight();
    UIHandler::display.clear();
}

UIHandler::~UIHandler() { delete UIHandler::instancePtr; }

UIHandler* UIHandler::getInstance()
{
    if (UIHandler::instancePtr == NULL) {
        UIHandler::instancePtr = new UIHandler();
    }
    return UIHandler::instancePtr;
}

void UIHandler::makeWiFiConfigMessage(const String& ssid, const String& ip)
{
    UIHandler::clear();
    UIHandler::writeLine("5GHz not supported!", 2);
    UIHandler::makeScrollingText("Please add a WiFi network, to do so connect to the network provided!", 1);
    UIHandler::clear();
    UIHandler::writeLine("Network details: ", 1);
    UIHandler::writeLine("SSID: " + ssid, 3);
    UIHandler::writeLine("IP: " + ip, 4);
}

void UIHandler::writeLine(const String& msg, const uint8_t& line, const uint8_t& col)
{
    if (line < 1 || line > 4) {
        UIHandler::display.print("Invalid line number!");
    }
    UIHandler::display.setCursor(0, line - 1);
    UIHandler::display.print(msg);
}

void UIHandler::makeScrollingText(
    const String& msg, const uint8_t line, const uint16_t& delayTime, const uint8_t& cycles)
{
    String message = msg;
    for (int i = 0; i < LCD_COLUMNS; i++) {
        message = " " + message;
    }
    message += " ";
    for (uint8_t i = 0; i < cycles; i++) {
        for (unsigned int pos = 0; pos < message.length(); pos++) {
            UIHandler::display.setCursor(0, line - 1);
            UIHandler::display.print(message.substring(pos, pos + LCD_COLUMNS));
            delay(delayTime);
        }
    }
}

void UIHandler::clear() { UIHandler::display.clear(); }