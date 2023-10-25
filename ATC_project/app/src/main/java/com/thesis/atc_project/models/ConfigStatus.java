package com.thesis.atc_project.models;

public enum ConfigStatus {
    OK_STATUS(0),
    LOW_TEMP(1),
    HIGH_TEMP(2),
    LOW_LIGHT(3),
    HIGH_LIGHT(4),
    LOW_WATER(5),
    LEAKAGE(6),
    LOW_PH(7),
    HIGH_PH(8),
    FILTER_CLEAN(9),
    WATER_CHANGE(10),
    LIGHT_ON(11),
    LIGHT_OFF(12),
    FILTER_ON(13),
    FILTER_OFF(14),
    AIR_ON(15),
    AIR_OFF(16),
    SAMPLE_TIME(17),
    FEEDING_TIME(18),
    ERROR(255),
    ;
    private final int value;

    ConfigStatus(int val){
        value = val;
    }

    public int getValue() {
        return value;
    }
}
