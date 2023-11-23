<?php
/*
This file is responsible for updating an aquarium
Expects the aquarium's data as a json in the $_POST
*/
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!empty($_POST["id"]) && !empty($_POST["name"]) && !empty($_POST["length"]) && !empty($_POST["height"]) && !empty($_POST["width"]) && !empty($_POST["width"]) && !empty($_POST["fishCount"])) {
    $id = $_POST["id"];
    $name = $_POST["name"];
    $length = $_POST["length"];
    $height = $_POST["height"];
    $width = $_POST["width"];
    $fishCount = $_POST["fishCount"];

    $aquarium = new Aquarium($id, $name, $length, $height, $width, $fishCount);
    $res = $DAO->updateAquarium($aquarium);
    if (!$res) {
        $result["error"] = "Error while updating!";
    } else {
        $result["result"] = "Successfully updated!";
    }
} else {
    $result["error"] = "Missing data!";
}

$jsonResponse = json_encode(["data" => $result]);
echo ($jsonResponse);
die();