#ifndef SamplePeriod_h
#define SamplePeriod_h

/*----------------------------------------
The enum to track how often samples should be taken
------------------------------------------*/
enum SamplePeriod {
    S_15_MIN = 0,
    S_30_MIN = 1,
    S_1_HOUR = 2,
    S_2_HOUR = 3,
    S_3_HOUR = 4,
    S_6_HOUR = 5,
    S_12_HOUR = 6,
    S_1_DAY = 7,
};

#endif // !SamplePeriod_h