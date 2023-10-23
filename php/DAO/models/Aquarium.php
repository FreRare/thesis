<?php
class Aquarium
{
    private $id;
    private $name;
    private $length;
    private $height;
    private $width;

    public function __construct($id, $name, $length, $height, $width)
    {
        $this->id = $id;
        $this->name = $name;
        $this->length = $length;
        $this->height = $height;
        $this->width = $width;
    }

    public function getId() {return $this->id;}

	public function getName() {return $this->name;}

	public function getLength() {return $this->length;}

	public function getHeight() {return $this->height;}

	public function getWidth() {return $this->width;}
}