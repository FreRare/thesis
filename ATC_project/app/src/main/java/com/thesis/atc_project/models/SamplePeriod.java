package com.thesis.atc_project.models;

public enum SamplePeriod {
    S_15_MIN(1),
    S_30_MIN(2),
    S_1_HOUR(3),
    S_1_HOUR_30_MIN(4),
    S_2_HOUR(5),
    S_3_HOUR(6),
    S_6_HOUR(7),
    S_12_HOUR(8),
    S_1_DAY(9),
    ;
    private final int value;

    SamplePeriod(int value){
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
