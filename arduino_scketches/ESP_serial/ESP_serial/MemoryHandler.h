#ifndef MemoryHandler_h
#define MemoryHandler_h
#include "Arduino.h"
#include "EEPROM.h"

///////////////////////////////////////////////////////
// The memory address definitions, they stay constant
///////////////////////////////////////////////////////

#define WIFI_DATA_START_ADDRESS 0 // Wifi config data will be in ESP memory at 0
#define CONFIG_DATA_START_ADDRESS 0 // Config data will be in Arduino memory at 0
// Sensor data will be after config in Arduino memory
// The size of the config class is: 
// 6 * unsigned short (2 bytes) + 2 * float (4 bytes) + 6 * unsigned int (2 bytes) => 32
// This means it will go until address 31 -> leave out a byte just in case so address 21 should be good
#define SENSOR_DATA_START_ADDRESS 33


class MemoryHandler {
public:
  static const unsigned short EEPROM_SIZE = EEPROM.length();
  unsigned short actualAddress;
  const unsigned short wifiConfigDataStartAddress = WIFI_DATA_START_ADDRESS;
  const unsigned short configDataStartAddress = CONFIG_DATA_START_ADDRESS;
  const unsigned short sensorDataStartAddress = SENSOR_DATA_START_ADDRESS;
  MemoryHandler();
  ~MemoryHandler();
  // Writes a string to the EEPROM
  void writeWord(const String& str);
  // Reads a string from the EEPROM
  String readWord();
  void clearMemory(const int& addr1, const int& addr2);
};

#endif