package com.thesis.atc_project.models;

public enum LightIntensity {
    DARK(1),
    SHADY(2),
    MEDIUM(3),
    LIGHT(4),
    BRIGHT(5),
    ;

    private final int value;

    LightIntensity(int i){
        this.value = i;
    }

    public int getValue() {
        return value;
    }
}
