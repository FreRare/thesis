#ifndef deviceInit_h
#define deviceInit_h
#include <Arduino.h>

// PIN DEFINITIONS
//-------------------------
#define RELAY_PIN D7
#define ANALOG_SENSOR_PIN A0
#define DIGITAL_TEMP_SENSOR_PIN D5
#define MUX_SELECT_A D3
#define MUX_SELECT_B D4
//-----------------------------

// PIN SETUP
/**
 * @brief Initial pin setup of the device
 * Sets all pins to the right mode
 */
void pinSetup();

#endif //! deviceInit.h