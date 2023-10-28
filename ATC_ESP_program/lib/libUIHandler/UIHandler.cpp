#include <UIHandler.h>

LiquidCrystal_I2C UIHandler::display = LiquidCrystal_I2C(0x27, 20, 4);

UIHandler::UIHandler()
{
    UIHandler::display.init();
    UIHandler::display.backlight();
    UIHandler::display.clear();
}

void UIHandler::writeLine(const String& msg, const uint8_t& line)
{
    if (line < 1 || line > 4) {
        UIHandler::display.print("Invalid line number!");
    }
    UIHandler::display.setCursor(0, line - 1);
    UIHandler::display.print(msg);
}