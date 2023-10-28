<?php

require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
$_POST = json_decode(file_get_contents("php://input"), true);
$result = [];
header("Content-Type: application/json");

if(empty($_POST)){
    $result["error"] = "No data posted!";
}
// The user have to give his data and the ID of the system he's using
if(empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST["first_name"] || empty($_POST["device_token"])) || empty($_POST["last_name"]) || empty($_POST["aquarium_id"])){
    $result["error"] = "Missing data!";
}

// If all data is present
if(!empty($_POST["email"]) && !empty($_POST["password"]) && !empty($_POST["first_name"] && !empty($_POST["device_token"])) && !empty($_POST["last_name"]) && !empty($_POST["aquarium_id"])){
    $email = $_POST["email"];
    $password = $_POST["password"];
    $hashPass = hash("sha256", $password); // Hashed password is stored in the DB
    $firstName = $_POST["first_name"];
    $lastName = $_POST["last_name"];
    $aquariumId = $_POST["aquarium_id"];
    $deviceToken = $_POST["device_token"];

    // Check if the given ID is valid for an existing system
    $foudAuarium = $DAO->selectAquariumById($aquariumId);
    if(empty($foudAuarium)){
        $result["error"] = "Invalid aquarium ID provided (System with given ID not exists)!";
    }else{
        // User created from data
        $newUser = new User($email, $hashPass, $firstName, $lastName, $deviceToken);
        // Upload to db
        $DAO->createUser($newUser); // The new user
        $DAO->createAquariumConnection($newUser, $foudAuarium->getId()); // Connect the user to an existing system
        // Return the new user to react
        $result["user"] = $newUser;
    }
}
error_log(json_encode($result));
$responseJson = json_encode(["data" => $result]);
echo($responseJson);