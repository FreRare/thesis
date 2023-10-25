package com.thesis.atc_project.models;

public enum CleanPeriod {
    P_3_DAYS(1),
    P_5_DAYS(2),
    P_1_WEEK(3),
    P_2_WEEKS(4),
    P_3_WEEKS(5),
    P_1_MONTH(6),
    P_2_MOTHS(7),
    P_3_MONTHS(8),
    P_NEVER(255),
    ;

    private final int value;

    CleanPeriod(int i) {
        this.value = i;
    }

    public int getValue(){
        return value;
    }
}
