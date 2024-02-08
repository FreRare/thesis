<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/notification/NotificationControl.php");
$filePath = $_SERVER["DOCUMENT_ROOT"] . "/LOG/atc-log.log";
$now = (new DateTime())->format("Y-m-d H:i:s.u");

$content = "$now ATC/LOG";

$systemStats = [
    "OK_STATUS",
    "LOW_TEMP",
    "HIGH_TEMP",
    "LOW_PH",
    "HIGH_PH",
    "LOW_WATER",
    "OUTLET_1_ON",
    "OUTLET_1_OFF",
    "OUTLET_2_ON",
    "OUTLET_2_OFF",
    "OUTLET_3_ON",
    "OUTLET_3_OFF",
    "SAMPLE_TIME",
    "FEEDING_TIME",
    "BROKEN_LIGHT",
    "ERROR"
];

if (!isset($_POST)) {
    $content .= " => ERROR: NO POSTED DATA";
} else {
    $logStr = $_POST["log"];
    $id = $_POST["id"];
    $content .= " <System $id> => $logStr";
    // Select the status identifier
    $status = intval(trim(explode(":", $logStr)[1]));
    if ($status == 255) {
        $status = 15;
    }
    $content .= " === " . $systemStats[$status];

    /*
    Notification testing!!! WORKS!!!
    
    $user = $DAO->selectUserForAquarium($id);
    if ($user->getDeviceToken() == "NO_DEVICE_TOKEN") {
        error_log("For system user $id - Notifications are not permitted!");
    } else {
        $notificationCtrl = new NotificationControl($user->getDeviceToken());
        $notificationCtrl->send("Samples taken!");
    }*/
}
// Dump log to file
file_put_contents($filePath, $content . PHP_EOL, FILE_APPEND);