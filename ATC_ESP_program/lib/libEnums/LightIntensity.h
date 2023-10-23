#include "Arduino.h"
/*-----------------------------------------------
The enum to follow the intensity of light
Used both by config and samples
------------------------------------------------*/
enum LightIntensity : byte{
  DARK,
  SHADY,
  MEDIUM,
  LIGHT,
  BRIGHT,
};