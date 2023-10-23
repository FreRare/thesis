#include "MemoryHandler.h"
#include "Arduino.h"
#include "DebugUtils.h"
#include "EEPROM.h"

// The instance pointer to return when want to use class
MemoryHandler* MemoryHandler::instancePtr = new MemoryHandler();

// Constructor, setting the non constant values to 0
MemoryHandler::MemoryHandler()
{
    EEPROM.begin(MemoryHandler::EEPROM_SIZE);
    this->sensorRecordCount = 0;
    this->actualAddress = 0;
}

// Destructor freeing up the pointer
MemoryHandler::~MemoryHandler() { delete MemoryHandler::instancePtr; }

MemoryHandler* MemoryHandler::getInstance() { return MemoryHandler::instancePtr; }

// Writes a string to the EEPROM
void MemoryHandler::writeWord(const String& str)
{
    // Writing the string to rom
    for (unsigned int i = 0; i < str.length(); this->actualAddress++, i++) {
        EEPROM.write(this->actualAddress, str[i]);
    }
    // giving it the closer 0
    EEPROM.write(this->actualAddress++, '\0');
    if (EEPROM.commit()) {
        DEBUG_PRINT("Write successful");
    } else {
        DEBUG_PRINT("Unsuccessful write of " + str + "!");
    }
}

// Reads a string from the EEPROM
String MemoryHandler::readWord()
{
    String word;
    char readChar;
    // Reading char while we don't get a closer 0
    while (readChar != '\0') {
        readChar = char(EEPROM.read(this->actualAddress));
        DEBUG_PRINT(readChar);
        this->actualAddress++;
        if (readChar != '\0') {
            word += readChar;
        }
    }
    return word;
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
        DEBUG_PRINT("Deleting..." + (char)EEPROM.read(this->actualAddress));
        EEPROM.write(this->actualAddress, 0);
    }
    DEBUG_PRINT("Memory cleared from " + String(addr1) + " - " + String(addr2) + "! (upper address discluded)");
}