<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// ! THIS IS HOW WE ACCESS POST DATA FROM REACT NATIVE, $_POST IS NOT WORKING IN GENERAL
$_POST = json_decode(file_get_contents("php://input"), true);
$result = [];
header("Content-Type: application/json");