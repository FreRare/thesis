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
    LOW_LIGHT,
    HIGH_LIGHT,
    LOW_WATER,
    LEAKAGE,
    LOW_PH,
    HIGH_PH,
    FILTER_CLEAN,
    WATER_CHANGE,
    LIGHT_ON,
    LIGHT_OFF,
    FILTER_ON,
    FILTER_OFF,
    AIR_ON,
    AIR_OFF,
    SAMPLE_TIME,
    FEEDING_TIME,
    ERROR = 255,
};

#endif