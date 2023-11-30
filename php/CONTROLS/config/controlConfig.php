<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// ! THIS IS HOW WE ACCESS POST DATA FROM REACT NATIVE, $_POST IS NOT WORKING IN GENERAL
$_POST = json_decode(file_get_contents("php://input"), true);
$result = [];

// Validate data
// Email, if we have invalid email set field to null
if (isset($_POST["email"]) && !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    $result["error"] = "Invalid email address!";
    echo (json_encode($result));
    die();
}

// Escape special characters
foreach ($_POST as $key => $value) {
    $_POST[$key] = htmlspecialchars($value, ENT_QUOTES, "UTF-8");
}

header("Content-Type: application/json");