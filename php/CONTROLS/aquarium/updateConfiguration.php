<?php
/*
This file is responsible for updating the configuration of an aquarium
Expexts the config's data as json in $POST
*/
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

$keys = ["id", "minTemp", "maxTemp", "minPh", "maxPh", "OL1On", "OL1Off", "OL2On", "OL2Off", "OL3On", "OL3Off", "feedingTime", "foodPortions", "filterClean", "waterChange", "samplePeriod"];

foreach ($keys as $key) {
    if (!isset($_POST[$key])) {
        $result["error"] = "Missing data!";
        error_log("CONFIG UPDATE: Missing data with key: `${$key}`");
        break;
    }
}

if (!isset($result["error"])) {
    $id = $_POST["id"];
    $minTemp = $_POST["minTemp"];
    $maxTemp = $_POST["maxTemp"];
    $minPh = $_POST["minPh"];
    $maxPh = $_POST["maxPh"];
    $OL1On = $_POST["OL1On"];
    $OL1Off = $_POST["OL1Off"];
    $OL2On = $_POST["OL2On"];
    $OL2Off = $_POST["OL2Off"];
    $OL3On = $_POST["OL3On"];
    $OL3Off = $_POST["OL3Off"];
    $feedingTime = $_POST["feedingTime"];
    $foodPortions = $_POST["foodPortions"];
    $filterClean = $_POST["filterClean"];
    $waterChange = $_POST["waterChange"];
    $samplePeriod = $_POST["samplePeriod"];
    $lastModifiedDate = new DateTime("now");
    $config = new AquariumConfig($id, $minTemp, $maxTemp, $minPh, $maxPh, $OL1On, $OL1Off, $OL2On, $OL2Off, $OL3On, $OL3Off, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate);
    $res = $DAO->updateAQConfig($config);
    if (!$res) {
        $result["error"] = "Error while updating!";
    } else {
        $result["result"] = "Successfully updated!";
    }
}

$responseJson = json_encode(["data" => $result]);
echo ($responseJson);
die();