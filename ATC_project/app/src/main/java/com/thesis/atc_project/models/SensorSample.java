package com.thesis.atc_project.models;

public class SensorSample {
    private final int aquariumId;
    private final int temperature;
    private final float ph;
    private final int waterLvl;
    private final LightIntensity lightIntensity;

    public SensorSample(int aquariumId, int temperature, float ph, int waterLvl, LightIntensity lightIntensity) {
        this.aquariumId = aquariumId;
        this.temperature = temperature;
        this.ph = ph;
        this.waterLvl = waterLvl;
        this.lightIntensity = lightIntensity;
    }

    public int getAquariumId() {
        return aquariumId;
    }

    public int getTemperature() {
        return temperature;
    }

    public float getPh() {
        return ph;
    }

    public int getWaterLvl() {
        return waterLvl;
    }

    public LightIntensity getLightIntensity() {
        return lightIntensity;
    }
}
