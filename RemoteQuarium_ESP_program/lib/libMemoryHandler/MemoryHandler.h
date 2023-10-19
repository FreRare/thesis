#ifndef MemoryHandler_h
#define MemoryHandler_h
#include "Arduino.h"
#include "EEPROM.h"
////////////////////////////////////////////////////////////////////////////////////
// This class is responsible for the EEPROM interactions
// It is a Singleton, preventing any problems occuring from same time memory actions
//////////////////////////////////////////////////////////////////////////////////

class MemoryHandler {
private:
    static MemoryHandler* memoryHandler;
public:
    const unsigned short EEPROM_SIZE = EEPROM.length();
    const unsigned short wifiConfigDataStartAddress = 0;
    const unsigned short configDataStartAddress = 256; // WiFi credentials should be less than 256 bytes -> Both string is max 128 long
    const unsigned short sensorDataStartAddress = 528; // TODO depends on the length of config data
    const unsigned short sensorRecordLength = 128; // TODO depends on sensorData class members size
    unsigned short sensorRecordCount;
    unsigned short actualAddress; // Stores the address where [the memory pointer is/will be
    explicit MemoryHandler(); // only explicit constructor is allowed
    ~MemoryHandler();
    MemoryHandler(const MemoryHandler& m) = delete; // Remove copy constructor
    static MemoryHandler* getInstance();
    void writeWord(const String& str);
    String readWord();
    void writeShort(const unsigned short& s);
    unsigned short readShort();
    void writeFloat(const float& f);
    float readFloat();
    void writeInt(const int& i);
    int readInt();
    void writeByte(const byte& b);
    byte readByte();
    void clearMemory(const int& addr1, const int& addr2);
};

#endif