#include <UIHandler.h>

LiquidCrystal_I2C UIHandler::display = LiquidCrystal_I2C(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);
UIHandler* UIHandler::instancePtr = new UIHandler();

UIHandler::UIHandler()
    : lastPhValue(0.0F)
    , lastTempValue(0.0F)
{
    UIHandler::display.init();
    UIHandler::display.backlight();
    UIHandler::display.clear();
}

UIHandler::~UIHandler()
{
    delete instancePtr;
    instancePtr = nullptr;
}

UIHandler* UIHandler::getInstance()
{
    if (UIHandler::instancePtr == nullptr) {
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
    UIHandler::display.print(msg);
}

void UIHandler::makeScrollingText(const char* msg, const uint8_t line, const uint16_t& delayTime, const uint8_t& cycles)
{

    uint16_t msgLength = 0;
    while (msg[msgLength] != '\0') { // Find length of message
        msgLength++;
    }

    // Create a new message with enough spaces in it
    const uint16_t messageLen = msgLength + LCD_COLUMNS;
    char message[messageLen];
    for (int i = 0; i < messageLen; i++) {
        if (i >= msgLength) {
            message[i] = ' ';
        } else {
            message[i] = msg[i];
        }
    }
    message[messageLen - 1] = '\0';
    // Print floating text
    for (uint8_t i = 0; i < cycles; i++) {
        for (unsigned int pos = 0; pos < messageLen; pos++) {
            UIHandler::display.setCursor(0, line - 1);
            char messageSubStr[LCD_COLUMNS + 1];
            for (uint16_t i = 0; i < LCD_COLUMNS; i++) {
                messageSubStr[i] = message[pos + i];
            }
            messageSubStr[LCD_COLUMNS] = '\0';
            UIHandler::display.print(messageSubStr);
            delay(delayTime);
        }
    }
}

void coorigateDigits(int h, int min, char str[6])
{
    if (h > 9 && min > 9) {
        sprintf(str, "%2d:%2d", h, min);
    } else if (h > 9) {
        sprintf(str, "%2d:0%1d", h, min);
    } else if (min > 9) {
        sprintf(str, "0%1d:%2d", h, min);
    } else {
        sprintf(str, "0%1d:0%1d", h, min);
    }
}

void UIHandler::writeBasicInfo(const float& ph, const float& temp)
{
    UIHandler::display.clear();
    UIHandler::display.home();
    // Display clock data
    int h = hour();
    int min = minute();
    char clockStr[6]; // (2):(2)+\0 = 6
    coorigateDigits(h, min, clockStr);
    clockStr[5] = '\0';
    UIHandler::writeLine(clockStr, 1, 6);

    // Bitmap LCD symbols
    const char thermometerSymbol[8] = { B00100, B01010, B01010, B01010, B01010, B10001, B10001, B01110 };
    const char phSymbol[8] = { B11111, B00100, B01010, B10001, B01010, B00100, B10001, B11111 };

    UIHandler::display.createChar(1, thermometerSymbol);
    UIHandler::display.setCursor(0, 1);
    UIHandler::display.write((uint8_t)1); // Display the thermometer symbol
    UIHandler::display.createChar(2, phSymbol);
    UIHandler::display.setCursor(0, 2);
    UIHandler::display.write((uint8_t)2); // Display Ph symbol

    char tempStr[14]; // Temp: (2.1) °C+\0 = 14
    sprintf(tempStr, "Temp: %2.1f %cC", temp, (char)223);
    tempStr[13] = '\0';
    UIHandler::writeLine(tempStr, 2, 2);
    char phStr[10]; // Ph: (2.2)+\0 = 10
    sprintf(phStr, "Ph: %2.2f", ph);
    phStr[9] = '\0';
    UIHandler::writeLine(phStr, 3, 2);

    Serial.println("Printed status info to LCD.");
}

void UIHandler::clear() { UIHandler::display.clear(); }

void UIHandler::clearLine(const uint8_t& line)
{
    uint8_t lineNumber = line - 1;
    if (lineNumber > LCD_ROWS) {
        DEBUG_PRINTLN("Invalid row number! Defaulted to 0.");
        lineNumber = 0;
    }
    UIHandler::display.setCursor(0, line - 1);
    String clearMsg = "";
    for (int i = 0; i < LCD_COLUMNS; i++) {
        clearMsg += " ";
    }
    UIHandler::display.print(clearMsg);
}