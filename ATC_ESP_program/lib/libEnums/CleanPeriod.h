#ifndef CleanPeriod_h
#define CleanPeriod_h
/*-------------------------------------
The enum to provide info about the cleaning/water changing of the aquarium (used for both)
Each element is a period of time
---------------------------------------*/
enum CleanPeriod {
    P_3_DAYS = 1,
    P_5_DAYS,
    P_1_WEEK,
    P_2_WEEKS,
    P_3_WEEKS,
    P_1_MONTH,
    P_2_MOTHS,
    P_3_MONTHS,
    P_NEVER = 255,
};

#endif