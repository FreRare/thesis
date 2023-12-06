#ifndef deviceInit_h
#define deviceInit_h
#include <Arduino.h>

// PIN DEFINITIONS
//-------------------------
#define DIGITAL_TEMP_SENSOR_PIN D5 // For the digital temp sensor
#define RELAY_PIN D0 // MUX Y (for relays)
#define ANALOG_SENSOR_PIN A0 // MUX X (for sensors)
#define MUX_SELECT_A D3 // MUX A selector
#define MUX_SELECT_B D4 // MUX B selector
#define FEEDER_SERVO_PIN D6 // Servo pin for feeder (used in PWM)
#define WATER_LVL_SENSOR_POWER D7 // Water sensor power pin (to turn on/off the sensor)
#define CALIBRATION_BTN_PIN D8 // Button for calibrating the sensors, mostly the water lvl 100%
//-----------------------------

/**
 * @brief Initial pin setup of the device
 * Sets all pins to the right mode
 */
void pinSetup();

#endif //! deviceInit.h