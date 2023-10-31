<?php

// Performs a login like action (get's user data based on token)
// Used for auto login authorization

require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
$_POST = json_decode(file_get_contents("php://input"), true);
$result = [];
header("Content-Type: application/json");

if(empty($_POST["token"])){
    $result["error"] = "Missing data!";
}

if(!empty($_POST["token"])){
    $token = $_POST["token"];
    $user = $DAO->selectUserByToken($token);
    if(empty($user)){
        $result["error"] = "No user with given token found!";
    }else{
        $result["user"] = $user->toJSON();
    }
}
$jsonResponse = json_encode(["data"=>$result]);
echo($jsonResponse);