<?php
class AQConfig
{
    private $AquariumId;
    private $minTemp;

    private $maxTemp;
    private $minPh;
    private $maxPh;
    private $lightOn;
    private $lightOff;
    private $filterOn;
    private $filterOff;
    private $airOn;
    private $airOff;
    private $waterLvlAlert;
    private $prefLight;
    private $feedingTime;
    private $foodPortions;
    private $filterClean;
    private $waterChange;
    private $samplePeriod;
    private $lastModifiedDate;

    public function __construct($AquariumId, $minTemp, $maxTemp, $minPh, $maxPh, $lightOn, $lightOff, $filterOn, $filterOff, $airOn, $airOff, $waterLvlAlert, $prefLight, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate)
    {
        $this->AquariumId = $AquariumId;
        $this->minTemp = $minTemp;
        $this->maxTemp = $maxTemp;
        $this->minPh = $minPh;
        $this->maxPh = $maxPh;
        $this->lightOn = $lightOn;
        $this->lightOff = $lightOff;
        $this->filterOn = $filterOn;
        $this->filterOff = $filterOff;
        $this->airOn = $airOn;
        $this->airOff = $airOff;
        $this->waterLvlAlert = $waterLvlAlert;
        $this->prefLight = $prefLight;
        $this->feedingTime = $feedingTime;
        $this->foodPortions = $foodPortions;
        $this->filterClean = $filterClean;
        $this->waterChange = $waterChange;
        $this->samplePeriod = $samplePeriod;
        $this->lastModifiedDate = $lastModifiedDate;
    }

    public function getAquariumId()
    {
        return $this->AquariumId;
    }

    public function getMinTemp()
    {
        return $this->minTemp;
    }

    public function getMaxTemp()
    {
        return $this->maxTemp;
    }

    public function getMinPh()
    {
        return $this->minPh;
    }

    public function getMaxPh()
    {
        return $this->maxPh;
    }

    public function getLightOn()
    {
        return $this->lightOn;
    }

    public function getLightOff()
    {
        return $this->lightOff;
    }

    public function getFilterOn()
    {
        return $this->filterOn;
    }

    public function getFilterOff()
    {
        return $this->filterOff;
    }

    public function getAirOn()
    {
        return $this->airOn;
    }

    public function getAirOff()
    {
        return $this->airOff;
    }

    public function getWaterLvlAlert()
    {
        return $this->waterLvlAlert;
    }

    public function getPrefLight()
    {
        return $this->prefLight;
    }

    public function getFeedingTime()
    {
        return $this->feedingTime;
    }

    public function getFoodPortions()
    {
        return $this->foodPortions;
    }

    public function getFilterClean()
    {
        return $this->filterClean;
    }

    public function getWaterChange()
    {
        return $this->waterChange;
    }

    public function getSamplePeriod()
    {
        return $this->samplePeriod;
    }

    public function getLastModifiedDate()
    {
        return $this->lastModifiedDate;
    }


}