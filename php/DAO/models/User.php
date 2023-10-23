<?php

class User{
    private $email;
    private $password; // will be hashed with sha256
    private $firstName;
    private $lastName;

    public function __construct(string $email, string $password, string $firtName, string $lastName){
        $this->email = $email;
        $this->password = $password;
        $this->firstName = $firtName;
        $this->lastName = $lastName;
    }

    public function getEmail() {return $this->email;}

	public function getPassword() {return $this->password;}

	public function getfirstName() {return $this->firstName;}

	public function getLastName() {return $this->lastName;}
public function getFullName() {return ($this->firstName . $this->lastName);}

}