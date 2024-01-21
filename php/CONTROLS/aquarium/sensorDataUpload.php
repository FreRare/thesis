<?php
// This file is responsible for handling the incoming sensor data from the ESP
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

$keys = ["id", "temp", "ph", "light", "water", "timestamp"];
$error = false;
foreach ($keys as $key) {
    if (!isset($_POST[$key])) {
        error_log("UPLOAD SAMPLE: Missing data with key: " . $key);
        $error = true;
    }
}

if (!$error) {
    $id = $_POST["id"];
    $temp = $_POST["temp"];
    $ph = $_POST["ph"];
    $light = $_POST["light"];
    $water = $_POST["water"];
    $timestamp = $_POST["timestamp"];
    date_default_timezone_set("Europe/Budapest");
    $dateStamp = new DateTime(date("Y-m-d H:i:s", strval($timestamp)), new DateTimeZone("Europe/Budapest"));
    $dateStamp->modify("-1 hour"); // IDK why but it's running 1h

    $sample = new SensorSample($id, $dateStamp, $temp, $ph, $water, $light);

    $res = $DAO->createSensorSample($sample);
    if (!$res) {
        error_log("UPLOAD SAMPLE: Error while creating sample!");
    }
}
header("HTTP/1.1 200 OK");
echo ("OK");