#ifndef ConfigStatus_h
#define ConfigStatus_h
/***********************************************
The enumeration to provide info about the status of the aquarium
Each element represents a state which can trigger actions if detected
***********************************************/

enum ConfigStatus {
    OK_STATUS = 0,
    LOW_TEMP = 1,
    HIGH_TEMP = 2,
    LOW_PH = 3,
    HIGH_PH = 4,
    LOW_WATER = 5,
    OUTLET_1_ON = 6,
    OUTLET_1_OFF = 7,
    OUTLET_2_ON = 8,
    OUTLET_2_OFF = 9,
    OUTLET_3_ON = 10,
    OUTLET_3_OFF = 11,
    SAMPLE_TIME = 12,
    FEEDING_TIME = 13,
    BROKEN_LIGHT = 14,
    ERROR = 255,
};

#endif