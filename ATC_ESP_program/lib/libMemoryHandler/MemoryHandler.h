#ifndef MemoryHandler_h
#define MemoryHandler_h
#include "ConfigData.h"
#include <Arduino.h>
#include <EEPROM.h>

////////////////////////////////////////////////////////////////////////////////////
// This class is responsible for the EEPROM interactions
// It is a Singleton, preventing any problems occuring from same time memory actions
//////////////////////////////////////////////////////////////////////////////////

#define EEPROM_SIZE 512
#define EEPROM_ADDRESS_DIFF 40

class MemoryHandler {
private:
    static MemoryHandler* instancePtr;
    explicit MemoryHandler(); // only explicit constructor is allowed
public:
    const uint16_t wifiConfigDataStartAddress = 0;
    const uint16_t systemIdentificationNumberAddress
        = EEPROM_ADDRESS_DIFF * 4; // WiFi credentials are 40 char * 2 + 40 diff * 2 = 40*4
    const uint16_t configDataStartAddress = EEPROM_ADDRESS_DIFF * 6; //
    uint16_t sensorRecordCount;
    uint16_t actualAddress; // Stores the address where [the memory pointer is/will be
    ~MemoryHandler();
    MemoryHandler(const MemoryHandler& m) = delete; // Remove copy constructor
    MemoryHandler operator=(const MemoryHandler& m) = delete;
    static MemoryHandler* getInstance();
    /**
     * Writes the given string to the EEPROM
     */
    void writeWord(const String& str);
    /**
     * Reads a word from the EEPROM
     * The address will be the MemoryHandler.actualAddress
     * Make sure to set it to the correct address before!
     */
    String readWord();
    void writeInt(const uint16_t& i);
    uint16_t readInt();
    void writeConfigData(const ConfigData& data);
    ConfigData readConfigData();
    /**
     * Clears the memory (writes 0-s)
     * addr2 is the used EEPROM_SIZE by default
     */
    void clearMemory(const int& addr1, const int& addr2 = EEPROM_SIZE);
};

#endif