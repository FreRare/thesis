<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/inputConfig.php");
$DAO = AQDAO::getInstance();

// Validate data
// Email, if we have invalid email set field to null
if (isset($_POST["email"]) && !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    $result["error"] = "Invalid email address!";
    echo (json_encode($result));
    die();
}
header("Content-Type: application/json");