<?php
class SensorSample
{
    private $id;
    private $sampleTime;
    private $temp;
    private $ph;
    private $waterLvl;
    private $lightAmount;
    public function __construct($id, $sampleTime, $temp, $ph, $waterLvl, $lightAmount)
    {
        $this->id = $id;
        $this->sampleTime = $sampleTime;
        $this->temp = $temp;
        $this->ph = $ph;
        $this->waterLvl = $waterLvl;
        $this->lightAmount = $lightAmount;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getSampleTime()
    {
        return $this->sampleTime;
    }

    public function getTemp()
    {
        return $this->temp;
    }

    public function getPh()
    {
        return $this->ph;
    }

    public function getWaterLvl()
    {
        return $this->waterLvl;
    }

    public function getLightAmount()
    {
        return $this->lightAmount;
    }


}