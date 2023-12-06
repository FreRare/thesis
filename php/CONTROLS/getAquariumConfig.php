<?php
// This file is responsible to get config for an aquarium
// Expexts an 'id' in post for the aquariums id also a phone flag if the request is coming from phone
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (isset($_POST["id"])) {
    $aqId = $_POST["id"];
    $config = $DAO->selectAQConfigForAquarium($aqId);
    if ($config == null) {
        $result["error"] = "No config existing for given aquarium! This should never happen...";
    } else {
        // When requested form phone we add an extra flag
        if (isset($_POST["phone"])) {
            $result = $config->toPhoneJSON();
        } else {
            $result = $config->toEspJSON();
        }
    }
} else {
    $result["error"] = "Missing data!";
}

$responseJson = json_encode(["data" => $result]);
echo ($responseJson);
die();