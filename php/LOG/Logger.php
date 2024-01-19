<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");
$filePath = $_SERVER["DOCUMENT_ROOT"] . "/LOG/LOG.txt";
$now = date("Y-m-d H:i:s");


if (!isset($_POST)) {
    $content = "$now => ERROR: NO POSTED DATA";
} else {
    $logStr = $_POST["log"];
    $content = "$now => $logStr";
}
// Dump log to file
file_put_contents($filePath, $content . PHP_EOL, FILE_APPEND);