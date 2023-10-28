<?php

class User
{
    private $email;
    private $password; // will be hashed with sha256
    private $firstName;
    private $lastName;
    private $deviceToken;

    public function __construct(string $email = "", string $password = "", string $firtName = "", string $lastName = "", string $deviceToken="")
    {
        $this->email = $email;
        $this->password = $password;
        $this->firstName = $firtName;
        $this->lastName = $lastName;
        $this->deviceToken = $deviceToken;
    }

    public function getEmail() : string
    {
        return $this->email;
    }

    public function getPassword() : string
    {
        return $this->password;
    }

    public function getFirstName() : string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }
    public function getFullName(): string
    {
        return ($this->firstName . $this->lastName);
    }
    public function getDeviceToken() : string{
        return $this->deviceToken;
    }
}