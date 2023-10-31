<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
$response = [];
// ! THIS IS HOW WE ACCESS POST DATA FROM REACT NATIVE, $_POST IS NOT WORKING IN GENERAL
$_POST = json_decode(file_get_contents("php://input"), true);
// If we have no data
if(empty($_POST)){
    $response["error"] = "No data posted!";
}
// If we have no needed fields
if(empty($_POST["email"]) || empty($_POST["password"])){
    $response["error"] = "Missing data!";
}
// If we have all
if(!empty($_POST["email"]) && !empty($_POST["password"])){
    // Exportnig vars
    $email = $_POST["email"];
    $password = $_POST["password"];
    $hashedPass = hash("sha256", $password);
    // Try to find user with given email
    $tryUser = $DAO->selectUserByEmail($email); // Trying to get user by email provided
    // If we didn't find user or password is incorrect
    if(empty($tryUser) || $tryUser->getPassword() !== $hashedPass){
        $response["error"] = "Invalid email address or password!";
    }else{
        // If found user and password matches set response to the user
        $response = $tryUser->toJSON();
    }
}
// Making valid json from the response
$responseJson = json_encode(["data" => $response]);
header("Content-Type: application/json");
echo($responseJson);