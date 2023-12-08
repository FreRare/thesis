#ifndef deviceInit_h
#define deviceInit_h
#include <Arduino.h>

// PIN DEFINITIONS
//-------------------------
#define DIGITAL_TEMP_SENSOR_PIN D9 // For the digital temp sensor
#define ANALOG_SENSOR_PIN A0 // MUX X (for sensors)
#define MUX_SELECT_A D7 // MUX A selector
#define MUX_SELECT_B D6 // MUX B selector
#define FEEDER_MOTOR_PIN D5 // Servo pin for feeder (used in PWM)
#define CALIBRATION_BTN_PIN D8 // Button for calibrating the sensors, mostly the water lvl 100%
#define RELAY_CH1_PIN D4
#define RELAY_CH2_PIN D3
#define RELAY_CH3_PIN D0
//-----------------------------

/**
 * @brief Initial pin setup of the device
 * Sets all pins to the right mode
 */
void pinSetup();

#endif //! deviceInit.h