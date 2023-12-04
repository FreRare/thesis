#ifndef ConfigStatus_h
#define ConfigStatus_h
/***********************************************
The enumeration to provide info about the status of the aquarium
Each element represents a state which can trigger actions if detected
***********************************************/

enum ConfigStatus {
    OK_STATUS,
    LOW_TEMP,
    HIGH_TEMP,
    LOW_PH,
    HIGH_PH,
    LOW_WATER,
    LEAKAGE,
    OUTLET_1_ON,
    OUTLET_1_OFF,
    OUTLET_2_ON,
    OUTLET_2_OFF,
    OUTLET_3_ON,
    OUTLET_3_OFF,
    SAMPLE_TIME,
    FEEDING_TIME,
    BROKEN_LIGHT,
    ERROR = 255,
};

#endif