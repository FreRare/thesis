<?php

require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();

if(empty($_POST)){
    die("ERROR: No data posted!");
}
// The user have to give his data and the ID of the system he's using
if(empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST["first_name"]) || empty($_POST["last_name"]) || empty($_POST["aquarium_id"])){
    die("ERROR: Missing data!");
}
$email = $_POST["email"];
$password = $_POST["password"];
$hashPass = hash("sha256", $password); // Hashed password is stored in the DB
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$aquariumId = $_POST["aquarium_id"];
// User and the new System is stored here
$newUser = new User($email, $hashedPass, $firstName, $lastName);
$newAquarium = new Aquarium($aquariumId, "My aqurium", 60, 30, 30);
// Upload to db
$DAO->createUser($newUser); // The new user
$DAO->createAquarium($newAquarium); // It's aquarium, later it can be modified
$DAO->createAquariumConnection($newUser, $newAquarium);

echo($newUser->toJson()); // If registration is successful give back the user