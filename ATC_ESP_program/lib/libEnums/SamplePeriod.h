#include "Arduino.h"
/*----------------------------------------
The enum to track how often samples should be taken
------------------------------------------*/
enum SamplePeriod : byte {
  S_15_MIN = 1,
  S_30_MIN,
  S_1_HOUR,
  S_1_HOUR_30_MIN,
  S_2_HOUR,
  S_3_HOUR,
  S_6_HOUR,
  S_12_HOUR,
  S_1_DAY,
};