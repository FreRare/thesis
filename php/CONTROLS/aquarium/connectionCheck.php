<?php

// This file is for connection check and inserting an aquarium into the DB with a basic config belonging to it

require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// Create a new Aquarium (ID filed is ignorant)
$newAquarium = new Aquarium(0, "My Aquarium", 60, 30, 30, 10);
// After this the aquarium will have the inserted id
$newAquarium = $DAO->createAquarium($newAquarium);
if ($newAquarium == null) {
    error_log("Error: Unsuccessfuly aquarium creation!");
    header("Status: 500");
    die();
}
$newAquariumConfig = new AquariumConfig($newAquarium->getId());
$newConfig = $DAO->createAQConfig($newAquariumConfig);
if ($newConfig == null) {
    error_log("Unsuccessful config creation!");
    header("Status: 500");
    die();
}
// Create a response, we only need the ID
$response = ["system_id" => $newAquarium->getId()];
$jsonResponse = json_encode(["data" => $response]);
header("Content-Type: application/json");
echo ($jsonResponse);
die();