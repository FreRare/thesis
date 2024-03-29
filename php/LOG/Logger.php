<?php
require_once ($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/inputConfig.php");
require_once ($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/notification/NotificationControl.php");
require_once ($_SERVER["DOCUMENT_ROOT"] . "/DAO/models/SystemStatus.php");

/**
 * Logs the incoming data from the system
 */

$filePath = $_SERVER["DOCUMENT_ROOT"] . "/LOG/atc-log.log";
$now = (new DateTime())->format("Y-m-d H:i:s.u");

$content = "$now ATC/LOG";

if (!isset ($_POST)) {
    $content .= " => ERROR: NO POSTED DATA";
} else {
    if (!isset ($_POST["log"]) || !isset ($_POST["id"])) {
        $content .= " => ERROR: MISSING DATA!";
    } else {
        $logStr = $_POST["log"];
        $id = trim($_POST["id"]);
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
}
// Dump log to file
$FILE = fopen($filePath, 'a+');
if (flock($FILE, LOCK_EX)) {
    fwrite($FILE, $content . PHP_EOL);
    flock($FILE, LOCK_UN);
} else {
    error_log("LOGGER => Unable to lock file!");
}
fclose($FILE);