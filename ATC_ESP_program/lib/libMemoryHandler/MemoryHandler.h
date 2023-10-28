#ifndef MemoryHandler_h
#define MemoryHandler_h
#include "Arduino.h"
#include "ConfigData.h"
#include <ESP_EEPROM.h>

////////////////////////////////////////////////////////////////////////////////////
// This class is responsible for the EEPROM interactions
// It is a Singleton, preventing any problems occuring from same time memory actions
//////////////////////////////////////////////////////////////////////////////////

class MemoryHandler {
private:
    static MemoryHandler* instancePtr;
    explicit MemoryHandler(); // only explicit constructor is allowed
public:
    const uint16_t EEPROM_SIZE = EEPROM.length();
    const uint16_t wifiConfigDataStartAddress = 0;
    const uint16_t configDataStartAddress = 256; // WiFi credentials should be less than 256 bytes
    const uint16_t sensorDataStartAddress = 528; // TODO depends on config data size
    const uint16_t sensorRecordLength = 128; // TODO depends on sensorData class size
    uint16_t sensorRecordCount;
    uint16_t actualAddress; // Stores the address where [the memory pointer is/will be
    ~MemoryHandler();
    MemoryHandler(const MemoryHandler& m) = delete; // Remove copy constructor
    MemoryHandler operator=(const MemoryHandler& m) = delete;
    static MemoryHandler* getInstance();
    void writeWord(const String& str);
    String readWord();
    void writeConfigData(const ConfigData& data);
    ConfigData readConfigData();
    void clearMemory(const int& addr1, const int& addr2);
};

#endif