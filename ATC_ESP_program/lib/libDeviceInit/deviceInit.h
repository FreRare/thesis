#ifndef deviceInit_h
#define deviceInit_h
#include <Arduino.h>

/**
 * @brief This file has all the definitions of the used pins, regiter values and peripherial actions
 * Here lies all the pin definitions, the function that initializes all the pins 
 * and the functions that can be used to use the shift register
 * and the function that can be used to select a MUX channel
 */

// PIN DEFINITIONS (Relays and feeder will be controlled trough shift register)
// ! D1 & D2 are used by the LCD (it's mapped by onewire)
// ! D3 & D4 shouldn't be pulled low (boot fails)
//-------------------------
#define ANALOG_SENSOR_PIN A0 // MUX X (for sensors)
#define SHIFT_REGISTER_DATA_PIN D0 // Shift register data (DS)
#define SHIFT_REGISTER_CLK_PIN D5 // Shift register clock (SHCP)
#define SHIFT_REGISTER_LATCH_PIN D6 // Shift register latch (STCP)
#define DIGITAL_TEMP_SENSOR_PIN D9 // For the digital temp sensor (RX)
#define MUX_SELECT_A D8 // MUX A selector
#define MUX_SELECT_B D7 // MUX B selector

//-----------------------------

/**
 * @brief Initial pin setup of the ESP
 * Sets all pins to the right mode
 */
void pinSetup();


/**
 * @brief Writes the given data to the shift register connected
 * The provided 8 bit data get's written to the shift register using Arduino's shiftOut() function
 * @param data - the data we want put to the shift register
 */
void updateShiftRegister(uint8_t data);


/**
 * @brief Selects the given channel (0-3) on the multiplexer
 * @param channel - the channel we want to select (0-3)
 */
void selectMux(uint8_t channel);

#endif //! deviceInit.h