package com.thesis.atc_project.models;

public class AquariumConfig {
    private int minTemp;
    private int maxTemp;
    private LightIntensity preferredLight;
    private int waterLvlAlert;
    private float minPh;
    private float maxPh;
    private CleanPeriod filterChangePeriod;
    private CleanPeriod waterChangePeriod;
    private int lightOnTime; // Timings are storing the value of
    private int lightOffTime; // minutes past mindnight that day
    private int filterOnTime;
    private int filterOffTime;
    private int airOnTime;
    private int airOffTime;
    private int feedingTime;
    private SamplePeriod samplePeriod;
    private int feedingPortions;

    public AquariumConfig(int minTemp, int maxTemp, LightIntensity preferredLight, int waterLvlAlert, float minPh, float maxPh, CleanPeriod filterChangePeriod, CleanPeriod waterChangePeriod, int lightOnTime, int lightOffTime, int filterOnTime, int filterOffTime, int airOnTime, int airOffTime, int feedingTime, SamplePeriod samplePeriod, int feedingPortions) {
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.preferredLight = preferredLight;
        this.waterLvlAlert = waterLvlAlert;
        this.minPh = minPh;
        this.maxPh = maxPh;
        this.filterChangePeriod = filterChangePeriod;
        this.waterChangePeriod = waterChangePeriod;
        this.lightOnTime = lightOnTime;
        this.lightOffTime = lightOffTime;
        this.filterOnTime = filterOnTime;
        this.filterOffTime = filterOffTime;
        this.airOnTime = airOnTime;
        this.airOffTime = airOffTime;
        this.feedingTime = feedingTime;
        this.samplePeriod = samplePeriod;
        this.feedingPortions = feedingPortions;
    }

    public int getMinTemp() {
        return minTemp;
    }

    public void setMinTemp(int minTemp) {
        this.minTemp = minTemp;
    }

    public int getMaxTemp() {
        return maxTemp;
    }

    public void setMaxTemp(int maxTemp) {
        this.maxTemp = maxTemp;
    }

    public LightIntensity getPreferredLight() {
        return preferredLight;
    }

    public void setPreferredLight(LightIntensity preferredLight) {
        this.preferredLight = preferredLight;
    }

    public int getWaterLvlAlert() {
        return waterLvlAlert;
    }

    public void setWaterLvlAlert(int waterLvlAlert) {
        this.waterLvlAlert = waterLvlAlert;
    }

    public float getMinPh() {
        return minPh;
    }

    public void setMinPh(float minPh) {
        this.minPh = minPh;
    }

    public float getMaxPh() {
        return maxPh;
    }

    public void setMaxPh(float maxPh) {
        this.maxPh = maxPh;
    }

    public CleanPeriod getFilterChangePeriod() {
        return filterChangePeriod;
    }

    public void setFilterChangePeriod(CleanPeriod filterChangePeriod) {
        this.filterChangePeriod = filterChangePeriod;
    }

    public CleanPeriod getWaterChangePeriod() {
        return waterChangePeriod;
    }

    public void setWaterChangePeriod(CleanPeriod waterChangePeriod) {
        this.waterChangePeriod = waterChangePeriod;
    }

    public int getLightOnTime() {
        return lightOnTime;
    }

    public void setLightOnTime(int lightOnTime) {
        this.lightOnTime = lightOnTime;
    }

    public int getLightOffTime() {
        return lightOffTime;
    }

    public void setLightOffTime(int lightOffTime) {
        this.lightOffTime = lightOffTime;
    }

    public int getFilterOnTime() {
        return filterOnTime;
    }

    public void setFilterOnTime(int filterOnTime) {
        this.filterOnTime = filterOnTime;
    }

    public int getFilterOffTime() {
        return filterOffTime;
    }

    public void setFilterOffTime(int filterOffTime) {
        this.filterOffTime = filterOffTime;
    }

    public int getAirOnTime() {
        return airOnTime;
    }

    public void setAirOnTime(int airOnTime) {
        this.airOnTime = airOnTime;
    }

    public int getAirOffTime() {
        return airOffTime;
    }

    public void setAirOffTime(int airOffTime) {
        this.airOffTime = airOffTime;
    }

    public int getFeedingTime() {
        return feedingTime;
    }

    public void setFeedingTime(int feedingTime) {
        this.feedingTime = feedingTime;
    }

    public SamplePeriod getSamplePeriod() {
        return samplePeriod;
    }

    public void setSamplePeriod(SamplePeriod samplePeriod) {
        this.samplePeriod = samplePeriod;
    }

    public int getFeedingPortions() {
        return feedingPortions;
    }

    public void setFeedingPortions(int feedingPortions) {
        this.feedingPortions = feedingPortions;
    }
}
