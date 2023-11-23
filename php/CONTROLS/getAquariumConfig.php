<?php
// This file is responsible to get config for an aquarium
// Expexts an 'id' in post for the aquariums id
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!empty($_POST["id"])) {
    $aqId = $_POST["id"];
    $config = $DAO->selectAQConfigForAquarium($aqId);
    if (empty($config)) {
        $result["error"] = "No config existing for given aquarium! This should never happen...";
    } else {
        $result = $config->toPhoneJSON();
    }
} else {
    $result["error"] = "Missing data!";
}

$responseJson = json_encode(["data" => $result]);
echo ($responseJson);
die();