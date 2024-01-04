#include "MemoryHandler.h"

// The instance pointer to return when want to use class
MemoryHandler* MemoryHandler::instancePtr = new MemoryHandler();

// Constructor, setting the non-constant values to 0
MemoryHandler::MemoryHandler()
{
    EEPROM.begin(EEPROM_SIZE);
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
    this->actualAddress += EEPROM_ADDRESS_DIFF;
    return data;
}

void MemoryHandler::writeInt(const uint16_t& i)
{
    EEPROM.put(this->actualAddress, i);
    this->actualAddress += EEPROM_ADDRESS_DIFF;
    EEPROM.commit();
}

uint16_t MemoryHandler::readInt()
{
    uint16_t data = 0;
    EEPROM.get(this->actualAddress, data);
    return data;
}

void MemoryHandler::writeConfigData(ConfigData* configData)
{
    this->actualAddress = this->configDataStartAddress;
    EEPROM.put(this->actualAddress, *configData);
    EEPROM.commit();
    Serial.println("Wrote config data to memory: ");
    configData->print();
}

ConfigData* MemoryHandler::readConfigData()
{
    this->actualAddress = this->configDataStartAddress;
    ConfigData* config = new ConfigData();
    EEPROM.get(this->actualAddress, *config);
    return config;
}

// Clears the memory from 0 until length address
void MemoryHandler::clearMemory(const int& addr1, const int& addr2)
{
    this->actualAddress = addr1;
    for (; this->actualAddress < addr2; this->actualAddress++) {
        EEPROM.write(this->actualAddress, 0);
        Serial.println("Deleting...");
    }
    Serial.println("Memory cleared from " + String(addr1) + " - " + String(addr2) + "! (upper address not included)");
    EEPROM.commit();
    delay(10);
}