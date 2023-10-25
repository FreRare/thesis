<?php

class User
{
    private $email;
    private $password; // will be hashed with sha256
    private $firstName;
    private $lastName;

    public function __construct(string $email = "", string $password = "", string $firtName = "", string $lastName = "")
    {
        $this->email = $email;
        $this->password = $password;
        $this->firstName = $firtName;
        $this->lastName = $lastName;
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

    public final function toJson()
    {
        $t = [];
        $t["firstName"] = $this->getFirstName();
        $t["lastName"] = $this->getLastName();
        $t["email"] = $this->getEmail();
        $t["password"] = $this->getPassword();
        return json_encode(["user" => $t]);
    }
}