#ifndef deviceInit_h
#define deviceInit_h
#include <Arduino.h>

// PIN DEFINITIONS (Relays and feeder will be controlled trough shift register)
// ! D1 & D2 are used by the LCD
//-------------------------
#define ANALOG_SENSOR_PIN A0 // MUX X (for sensors)
#define DIGITAL_TEMP_SENSOR_PIN D9 // For the digital temp sensor (RX)
#define MUX_SELECT_A D8 // MUX A selector
#define MUX_SELECT_B D7 // MUX B selector
#define SHIFT_REGISTER_CLK_PIN D5 // Shift register clock
#define SHIFT_REGISTER_LATCH_PIN D6 // Shift register latch
#define SHIFT_REGISTER_DATA_PIN D0 // Shift register data
//-----------------------------

/**
 * @brief Initial pin setup of the ESP
 * Sets all pins to the right mode
 */
void pinSetup();

#endif //! deviceInit.h