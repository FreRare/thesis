<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/inputConfig.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/notification/NotificationControl.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/models/SystemStatus.php");

/**
 * Logs the incoming data from the system
 */

$filePath = $_SERVER["DOCUMENT_ROOT"] . "/LOG/atc-log.log";
$now = (new DateTime())->format("Y-m-d H:i:s.u");

$content = "$now ATC/LOG";

if (!isset($_POST)) {
    $content .= " => ERROR: NO POSTED DATA";
} else {
    if (!isset($_POST["log"]) || !isset($_POST["id"])) {
        $content .= " => ERROR: MISSING DATA!";
    } else {
        $logStr = $_POST["log"];
        $id = $_POST["id"];
        $content .= " <System $id> => $logStr";
        if (strstr($logStr, ':')) {
            // If the message includes : //! Only status messages should include ':' character
            // Select the status identifier
            $status = intval(trim(explode(":", $logStr)[1]));
            if ($status == 255) {
                $status = 15;
            }
            $content .= " === " . $systemStats[$status];
        }
    }

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