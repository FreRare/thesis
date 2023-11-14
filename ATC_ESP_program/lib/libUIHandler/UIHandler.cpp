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

void UIHandler::makeWiFiConfigMessage(const char* ssid, const char* ip)
{
    UIHandler::clear();
    UIHandler::writeLine("5GHz not supported!", 2);
    UIHandler::makeScrollingText("Please add a WiFi network, to do so connect to the network provided!", 1);
    UIHandler::clear();
    UIHandler::writeLine("Network details: ", 1);
    uint16_t ssidLength = 0;
    while (ssid[ssidLength] != '\0') {
        ssidLength++;
    }
    char ssidText[SSID_TEXT_LENGTH + ssidLength + 1];
    sprintf(ssidText, "SSID: %s", ssid);
    UIHandler::writeLine(ssidText, 3);
    uint16_t ipLength = 0;
    while (ip[ipLength] != '\0') {
        ipLength++;
    }
    char ipText[IP_TEXT_LENGTH + ipLength + 1];
    sprintf(ipText, "IP: %s", ip);
    UIHandler::writeLine(ipText, 4);
}

void UIHandler::writeLine(const char* msg, const uint8_t& line, const uint8_t& col)
{
    if (line < 1 || line > 4) {
        UIHandler::display.print("Invalid line number!");
    }
    UIHandler::display.setCursor(col, line - 1);
    Serial.print("Message on LCD: ");
    Serial.println(msg);
    UIHandler::display.print(msg);
}

void UIHandler::makeScrollingText(const char* msg, const uint8_t line, const uint16_t& delayTime, const uint8_t& cycles)
{

    uint16_t msgLength = 0;
    while (msg[msgLength] != '\0') { // Find length of message
        msgLength++;
    }

    const uint16_t messageLen = msgLength + LCD_COLUMNS;
    char message[messageLen];
    for (int i = 0; i < messageLen; i++) {
        if (i >= msgLength) {
            message[i] = ' ';
        } else {
            message[i] = msg[i];
        }
    }
    for (uint8_t i = 0; i < cycles; i++) {
        for (unsigned int pos = 0; pos < messageLen; pos++) {
            UIHandler::display.setCursor(0, line - 1);
            char messageSubStr[LCD_COLUMNS];
            for (uint16_t i = 0; i < LCD_COLUMNS; i++) {
                messageSubStr[i] = message[pos + i];
            }
            UIHandler::display.print(messageSubStr);
            delay(delayTime);
        }
    }
}

void UIHandler::clear() { UIHandler::display.clear(); }

void UIHandler::clearLine(const uint8_t& line)
{
    uint8_t lineNumber = line;
    if (lineNumber > LCD_ROWS) {
        Serial.println("Invalid row number! Defaulted to 0.");
        lineNumber = 0;
    }
    UIHandler::display.setCursor(0, line - 1);
    String clearMsg = "";
    for (int i = 0; i < LCD_COLUMNS; i++) {
        clearMsg += " ";
    }
    UIHandler::display.print(clearMsg);
}