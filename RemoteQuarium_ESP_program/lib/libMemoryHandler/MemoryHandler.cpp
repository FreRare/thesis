#include "MemoryHandler.h"
#include "Arduino.h"
#include "EEPROM.h"

MemoryHandler::MemoryHandler(){
  this->actualAddress = 0;
}

// Writes a string to the EEPROM
void MemoryHandler::writeWord(const String& str) {
  EEPROM.begin(MemoryHandler::EEPROM_SIZE);
  // Writing the string to rom
  for (unsigned int i = 0; i < str.length(); this->actualAddress++, i++) {
    EEPROM.write(this->actualAddress, str[i]);
  }
  // giving it the closer 0
  EEPROM.write(this->actualAddress++, '\0');
  if (EEPROM.commit()) {
    Serial.println("Write successful");
  } else {
    Serial.println("Unsuccessful write of " + str + "!");
  }
}

String MemoryHandler::readWord() {
  EEPROM.begin(MemoryHandler::EEPROM_SIZE);
  String word;
  char readChar;
  // Reading char while we don't get a closer 0
  while (readChar != '\0') {
    readChar = char(EEPROM.read(this->actualAddress));
    Serial.print(readChar);
    delay(10);
    this->actualAddress++;
    if (readChar != '\0') {
      word += readChar;
    }
  }
  return word;
}

// Clears the memory from 0 until length address
void MemoryHandler::clearMemory(const int& addr1, const int& addr2){
  this->actualAddress = addr1;
  for(;this->actualAddress < addr2;this->actualAddress++){
    Serial.println("Deleting..." + (char)EEPROM.read(this->actualAddress));
    delay(10);
    EEPROM.write(this->actualAddress, 0);
  }
  Serial.println("Memory cleared from " + String(addr1) +  " - " + String(addr2) + "! (upper address discluded)");
}