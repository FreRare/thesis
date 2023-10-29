<?php

// This file is for connection check and inserting an aquarium into the DB

require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// Create a new Aquarium (ID filed is ignorant)
$newAquarium = new Aquarium(0, "My Aquarium", 60, 30, 30);
// After this the aquarium will have the inserted id
$newAquarium = $DAO->createAquarium($newAquarium);
// Create a response, we only need the ID
$response = ["system_id" => $newAquarium->getId()];
$jsonResponse = json_encode(["data" => $response]);
header("Content-Type: application/json");
echo($jsonResponse);
die();