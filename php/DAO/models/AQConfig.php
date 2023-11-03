<?php
class AQConfig
{
    private $AquariumId;
    private $minTemp;

    private $maxTemp;
    private $minPh;
    private $maxPh;
    private $onOutlet1;
    private $offOutlet1;
    private $onOutlet2;
    private $offOutlet2;
    private $onOutet3;
    private $offOutlet3;
    private $waterLvlAlert;
    private $prefLight;
    private $feedingTime;
    private $foodPortions;
    private $filterClean;
    private $waterChange;
    private $samplePeriod;
    private $lastModifiedDate;

    public function __construct($AquariumId, $minTemp, $maxTemp, $minPh, $maxPh, $onOutlet1, $offOutlet1, $onOutlet2, $offOutlet2, $onOutet3, $offOutlet3, $waterLvlAlert, $prefLight, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate)
    {
        $this->AquariumId = $AquariumId;
        $this->minTemp = $minTemp;
        $this->maxTemp = $maxTemp;
        $this->minPh = $minPh;
        $this->maxPh = $maxPh;
        $this->onOutlet1 = $onOutlet1;
        $this->offOutlet1 = $offOutlet1;
        $this->onOutlet2 = $onOutlet2;
        $this->offOutlet2 = $offOutlet2;
        $this->onOutet3 = $onOutet3;
        $this->offOutlet3 = $offOutlet3;
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

    public function getOnOutlet1()
    {
        return $this->onOutlet1;
    }

    public function getOffOutlet1()
    {
        return $this->offOutlet1;
    }

    public function getOnOutlet2()
    {
        return $this->onOutlet2;
    }

    public function getOffOutlet2()
    {
        return $this->offOutlet2;
    }

    public function getOnOutlet3()
    {
        return $this->onOutet3;
    }

    public function getOffOutlet3()
    {
        return $this->offOutlet3;
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