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
    private $lastFilterCleanTime;
    private $waterChange;
    private $lastWaterChangeTime;
    private $samplePeriod;
    private $lastModifiedDate;

    public function __construct($AquariumId, $minTemp = 20, $maxTemp = 27, $minPh = 6.5, $maxPh = 8, $onOutlet1 = 0, $offOutlet1 = 0, $onOutlet2 = 0, $offOutlet2 = 0, $onOutet3 = 0, $offOutlet3 = 0, $waterLvlAlert = 0, $feedingTime = 600, $foodPortions = 1, $filterClean = 0, $lastFilterCleanTime = 0, $waterChange = 0,$lastWaterChangeTime = 0, $samplePeriod = 3, $lastModifiedDate = new DateTime())
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
        $this->waterLvlAlert = $waterLvlAlert;
        $this->feedingTime = $feedingTime;
        $this->foodPortions = $foodPortions;
        $this->filterClean = $filterClean;
        $this->lastFilterCleanTime = $lastFilterCleanTime;
        $this->waterChange = $waterChange;
        $this->lastWaterChangeTime = $lastWaterChangeTime;
        $this->samplePeriod = $samplePeriod;
        $this->lastModifiedDate = $lastModifiedDate;
    }

    public function getAquariumId() {return $this->AquariumId;}

	public function getMinTemp() {return $this->minTemp;}

	public function getMaxTemp() {return $this->maxTemp;}

	public function getMinPh() {return $this->minPh;}

	public function getMaxPh() {return $this->maxPh;}

	public function getOnOutlet1() {return $this->onOutlet1;}

	public function getOffOutlet1() {return $this->offOutlet1;}

	public function getOnOutlet2() {return $this->onOutlet2;}

	public function getOffOutlet2() {return $this->offOutlet2;}

	public function getOnOutlet3() {return $this->onOutlet3;}

	public function getOffOutlet3() {return $this->offOutlet3;}

	public function getWaterLvlAlert() {return $this->waterLvlAlert;}

	public function getFeedingTime() {return $this->feedingTime;}

	public function getFoodPortions() {return $this->foodPortions;}

	public function getFilterClean() {return $this->filterClean;}

	public function getLastFilterCleanTime() {return $this->lastFilterCleanTime;}

	public function getWaterChange() {return $this->waterChange;}

	public function getLastWaterChangeTime() {return $this->lastWaterChangeTime;}

	public function getSamplePeriod() {return $this->samplePeriod;}

	public function getLastModifiedDate() {return $this->lastModifiedDate;}

	public function setAquariumId( $AquariumId): void {$this->AquariumId = $AquariumId;}

	public function setMinTemp( $minTemp): void {$this->minTemp = $minTemp;}

	public function setMaxTemp( $maxTemp): void {$this->maxTemp = $maxTemp;}

	public function setMinPh( $minPh): void {$this->minPh = $minPh;}

	public function setMaxPh( $maxPh): void {$this->maxPh = $maxPh;}

	public function setOnOutlet1( $onOutlet1): void {$this->onOutlet1 = $onOutlet1;}

	public function setOffOutlet1( $offOutlet1): void {$this->offOutlet1 = $offOutlet1;}

	public function setOnOutlet2( $onOutlet2): void {$this->onOutlet2 = $onOutlet2;}

	public function setOffOutlet2( $offOutlet2): void {$this->offOutlet2 = $offOutlet2;}

	public function setOnOutet3( $onOutet3): void {$this->onOutet3 = $onOutet3;}

	public function setOffOutlet3( $offOutlet3): void {$this->offOutlet3 = $offOutlet3;}

	public function setWaterLvlAlert( $waterLvlAlert): void {$this->waterLvlAlert = $waterLvlAlert;}

	public function setFeedingTime( $feedingTime): void {$this->feedingTime = $feedingTime;}

	public function setFoodPortions( $foodPortions): void {$this->foodPortions = $foodPortions;}

	public function setFilterClean( $filterClean): void {$this->filterClean = $filterClean;}

	public function setLastFilterCleanTime( $lastFilterCleanTime): void {$this->lastFilterCleanTime = $lastFilterCleanTime;}

	public function setWaterChange( $waterChange): void {$this->waterChange = $waterChange;}

	public function setLastWaterChangeTime( $lastWaterChangeTime): void {$this->lastWaterChangeTime = $lastWaterChangeTime;}

	public function setSamplePeriod( $samplePeriod): void {$this->samplePeriod = $samplePeriod;}

	public function setLastModifiedDate( $lastModifiedDate): void {$this->lastModifiedDate = $lastModifiedDate;}
    
    public function toPhoneJSON(){
        throw new \Exception("Not implemented");
    }

    public function toEspJSON(){
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
        $t["waterLvlAlert"] = $this->waterLvlAlert;
        $t["feedingTime"] = $this->feedingTime;
        $t["foodPortions"] = $this->foodPortions;
        $t["samplePeroid"] = $this->samplePeriod;

        return json_encode(["config" => $t]);
    }
}