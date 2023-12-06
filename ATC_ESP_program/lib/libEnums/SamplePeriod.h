#ifndef SamplePeriod_h
#define SamplePeriod_h

/*----------------------------------------
The enum to track how often samples should be taken
------------------------------------------*/
enum SamplePeriod {
    S_15_MIN = 1,
    S_30_MIN = 2,
    S_1_HOUR = 3,
    S_1_HOUR_30_MIN = 4,
    S_2_HOUR = 5,
    S_3_HOUR = 6,
    S_6_HOUR = 7,
    S_12_HOUR = 8,
    S_1_DAY = 9,
};

#endif // !SamplePeriod_h