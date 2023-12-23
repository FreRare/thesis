<?php
class AquariumConfig
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
    private $onOutlet3;
    private $offOutlet3;
    private $waterLvlAlert;
    private $feedingTime;
    private $foodPortions;
    private $filterClean;
    private $waterChange;
    private $samplePeriod;
    private $lastModifiedDate;

    public function __construct(int $AquariumId, float $minTemp = 20, float $maxTemp = 28, float $minPh = 6.5, float $maxPh = 8, int $onOutlet1 = 480, int $offOutlet1 = 1200, int $onOutlet2 = 480, int $offOutlet2 = 1200, int $onOutet3 = 480, int $offOutlet3 = 1200, int $feedingTime = 600, int $foodPortions = 1, int $filterClean = 0, int $waterChange = 0, int $samplePeriod = 2, DateTime $lastModifiedDate = null)
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
        $this->onOutlet3 = $onOutet3;
        $this->offOutlet3 = $offOutlet3;
        $this->feedingTime = $feedingTime;
        $this->foodPortions = $foodPortions;
        $this->filterClean = $filterClean;
        $this->waterChange = $waterChange;
        $this->samplePeriod = $samplePeriod;
        if ($lastModifiedDate === null) {
            $this->lastModifiedDate = new DateTime();
        } else {
            $this->lastModifiedDate = $lastModifiedDate;
        }
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
        return $this->onOutlet3;
    }

    public function getOffOutlet3()
    {
        return $this->offOutlet3;
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

    public function setAquariumId($AquariumId): void
    {
        $this->AquariumId = $AquariumId;
    }

    public function setMinTemp($minTemp): void
    {
        $this->minTemp = $minTemp;
    }

    public function setMaxTemp($maxTemp): void
    {
        $this->maxTemp = $maxTemp;
    }

    public function setMinPh($minPh): void
    {
        $this->minPh = $minPh;
    }

    public function setMaxPh($maxPh): void
    {
        $this->maxPh = $maxPh;
    }

    public function setOnOutlet1($onOutlet1): void
    {
        $this->onOutlet1 = $onOutlet1;
    }

    public function setOffOutlet1($offOutlet1): void
    {
        $this->offOutlet1 = $offOutlet1;
    }

    public function setOnOutlet2($onOutlet2): void
    {
        $this->onOutlet2 = $onOutlet2;
    }

    public function setOffOutlet2($offOutlet2): void
    {
        $this->offOutlet2 = $offOutlet2;
    }

    public function setOnOutet3($onOutet3): void
    {
        $this->onOutet3 = $onOutet3;
    }

    public function setOffOutlet3($offOutlet3): void
    {
        $this->offOutlet3 = $offOutlet3;
    }

    public function setFeedingTime($feedingTime): void
    {
        $this->feedingTime = $feedingTime;
    }

    public function setFoodPortions($foodPortions): void
    {
        $this->foodPortions = $foodPortions;
    }

    public function setFilterClean($filterClean): void
    {
        $this->filterClean = $filterClean;
    }

    public function setWaterChange($waterChange): void
    {
        $this->waterChange = $waterChange;
    }

    public function setSamplePeriod($samplePeriod): void
    {
        $this->samplePeriod = $samplePeriod;
    }

    public function setLastModifiedDate($lastModifiedDate): void
    {
        $this->lastModifiedDate = $lastModifiedDate;
    }

    public function toPhoneJSON()
    {
        $t = [];
        $t["minTemp"] = $this->minTemp;
        $t["maxTemp"] = $this->maxTemp;
        $t["minPh"] = $this->minPh;
        $t["maxPh"] = $this->maxPh;
        $t["ol1On"] = $this->onOutlet1;
        $t["ol2On"] = $this->onOutlet2;
        $t["ol3On"] = $this->onOutlet3;
        $t["ol1Off"] = $this->offOutlet1;
        $t["ol2Off"] = $this->offOutlet2;
        $t["ol3Off"] = $this->offOutlet3;
        $t["feedingTime"] = $this->feedingTime;
        $t["foodPortions"] = $this->foodPortions;
        $t["filterClean"] = $this->filterClean;
        $t["waterChange"] = $this->waterChange;
        $t["samplePeroid"] = $this->samplePeriod;
        $t["lastModifiedDate"] = $this->lastModifiedDate;

        return (["config" => $t]);
    }

    public function toEspJSON()
    {
        $t = [];
        $t["minTemp"] = $this->minTemp;
        $t["maxTemp"] = $this->maxTemp;
        $t["minPh"] = $this->minPh;
        $t["maxPh"] = $this->maxPh;
        $t["ol1On"] = $this->onOutlet1;
        $t["ol2On"] = $this->onOutlet2;
        $t["ol3On"] = $this->onOutlet3;
        $t["ol1Off"] = $this->offOutlet1;
        $t["ol2Off"] = $this->offOutlet2;
        $t["ol3Off"] = $this->offOutlet3;
        $t["feedingTime"] = $this->feedingTime;
        $t["foodPortions"] = $this->foodPortions;
        $t["samplePeriod"] = $this->samplePeriod;

        return (["config" => $t]);
    }
}