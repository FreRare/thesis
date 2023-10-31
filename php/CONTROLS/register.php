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
    
    $authToken = uniqid(more_entropy:true); // generate unique token for user
    while($DAO->selectUserByToken($authToken) !== null){ // make sure it's unique
        $authToken = uniqid(more_entropy:true);
    }

    // If email is taken
    if($DAO->selectUserByEmail($email) !== null){
        $result["error"] = "This email address is already in use!";
        $responseJson = json_encode(["data" => $result]);
        echo($responseJson);    
        die();
    }
    // If system ID is taken
    if($DAO->selectAquariumById($aquariumId) !== null){
        $result["error"] = "This aquarium ID is already owned by a user!";
        $responseJson = json_encode(["data" => $result]);
        echo($responseJson);
        die();
    }

    // Check if the given ID is valid for an existing system
    $foudAuarium = $DAO->selectAquariumById($aquariumId);
    if(!$foudAuarium instanceof Aquarium){
        $result["error"] = "Invalid aquarium ID provided (System with given ID not exists)!";
    }else{
        // User created from data
        $newUser = new User($email, $hashPass, $firstName, $lastName, $deviceToken, $authToken);
        // Upload to db
        $DAO->createUser($newUser); // The new user
        $DAO->createAquariumConnection($newUser, $foudAuarium); // Connect the user to an existing system
        // Return the new user to react
        $result = $newUser->toJSON();
    }
}
error_log(json_encode($result));
$responseJson = json_encode(["data" => $result]);
echo($responseJson);