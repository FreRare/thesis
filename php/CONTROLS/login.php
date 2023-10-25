<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();

if(empty($_POST)){
    die("ERROR: No data posted!");
}
if(empty($_POST["email"]) || empty($_POST["password"])){
    die("ERROR: Missing data!");
}
$email = $_POST["email"];
$password = $_POST["password"];
$hashedPass = hash("sha256", $password);

$tryUser = $DAO->selectUserByEmail($email); // Trying to get user by email provided

if(empty($tryUser) || $tryUser->getPassword() != $hashedPass){
    die("ERROR: Invalid email address or password!");
}
// If found user and password matches give back the User data
echo($tryUser->toJson());
