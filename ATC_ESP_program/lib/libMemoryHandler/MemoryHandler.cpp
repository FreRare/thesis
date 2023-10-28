#include <Arduino.h>
#include <DebugUtils.h>
#include <EEPROM.h>
#include <MemoryHandler.h>

// The instance pointer to return when want to use class
MemoryHandler* MemoryHandler::instancePtr = new MemoryHandler();

// Constructor, setting the non constant values to 0
MemoryHandler::MemoryHandler()
{
    EEPROM.begin(EEPROM_SIZE);
    this->sensorRecordCount = 0;
    this->actualAddress = 0;
}

// Destructor freeing up the pointer
MemoryHandler::~MemoryHandler() { delete MemoryHandler::instancePtr; }

MemoryHandler* MemoryHandler::getInstance()
{
    if (MemoryHandler::instancePtr == NULL) {
        MemoryHandler::instancePtr = new MemoryHandler();
    }
    return MemoryHandler::instancePtr;
}

void MemoryHandler::writeWord(const String& str)
{
    char charStr[EEPROM_ADDRESS_DIFF] = ""; // Cannot write string
    strcpy(charStr, str.c_str()); // So convert to char array
    EEPROM.put(this->actualAddress, charStr);
    this->actualAddress += EEPROM_ADDRESS_DIFF;
    EEPROM.commit();
}

// Reads a string from the EEPROM
String MemoryHandler::readWord()
{
    char word[EEPROM_ADDRESS_DIFF] = "";
    EEPROM.get(this->actualAddress, word);
    String data = word;
    for (int i = 0; i < EEPROM_ADDRESS_DIFF; i++) {
        Serial.println(word[i]);
    }
    this->actualAddress += EEPROM_ADDRESS_DIFF;
    return data;
}

void MemoryHandler::writeConfigData(const ConfigData& configData)
{
    this->actualAddress = this->configDataStartAddress;
    EEPROM.put(this->actualAddress, configData);
}

// Clears the memory from 0 until length address
void MemoryHandler::clearMemory(const int& addr1, const int& addr2)
{
    this->actualAddress = addr1;
    for (; this->actualAddress < addr2; this->actualAddress++) {
        Serial.println("Deleting..." + (char)EEPROM.read(this->actualAddress));
        EEPROM.write(this->actualAddress, 0);
    }
    Serial.println("Memory cleared from " + String(addr1) + " - " + String(addr2) + "! (upper address discluded)");
    EEPROM.commit();
    delay(10);
}