<?php
class Aquarium
{
    private $id;
    private $name;
    private $length;
    private $height;
    private $width;
    private $fishCount;

    public function __construct($id, $name, $length, $height, $width, $fishCount)
    {
        $this->id = $id;
        $this->name = $name;
        $this->length = $length;
        $this->height = $height;
        $this->width = $width;
        $this->fishCount = $fishCount;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getLength()
    {
        return $this->length;
    }

    public function getHeight()
    {
        return $this->height;
    }

    public function getWidth()
    {
        return $this->width;
    }
    public function getfishCount()
    {
        return $this->fishCount;
    }
    public function toString()
    {
        return "AQUARIUM: " . $this->getName() . "::" . $this->getId() . "::" . $this->getLength() . "::" . $this->getHeight() . "::" . $this->getWidth();
    }

    public function toJSON()
    {
        $t = [];
        $t["id"] = $this->getId();
        $t["name"] = $this->getName();
        $t["length"] = $this->getLength();
        $t["height"] = $this->getHeight();
        $t["width"] = $this->getWidth();
        $t["fishCount"] = $this->getfishCount();

        return json_encode(["aquarium" => $t]);
    }
}