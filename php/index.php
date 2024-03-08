<?php
echo ("Server welcome!" . "</br>");
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ONLY UNCOMMENT IF YOU WANT TO RE-INITIALIZE DATABASE, IT DROPS ALL TABLES
// 
//!require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/dbInit.php');
// 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// $userRes = $DAO->createAquarium(new Aquarium(0, "My first aquarium", 60, 30, 30, 12));
// $config = $DAO->createAQConfig(new AquariumConfig(1));

//* code to print all sensor samples
/*
$user = $DAO->selectSensorSamplesForAquarium(1, false);
foreach ($user as $u) {
    echo ($u->toJSON());
    echo ("</br>");
}
$config = $DAO->selectAQConfigForAquarium(1);
var_dump($config);
*/

//* code to print log, freezes the site xdd
/*
$file = $_SERVER['DOCUMENT_ROOT'] . "/LOG/atc-log.log";
$lines = 3000;
$handle = fopen($file, 'r');
if ($handle) {
    $line = 0;
    $pos = -2;
    $beggining = false;
    $text = array();
    // Loop until you have the number of lines required or reached the beginning of the file
    while ($line_count < $lines) {
        $t = " ";
        while ($t != "\n") {
            if (fseek($handle, $pos, SEEK_END) == -1) {
                $beginning = true;
                break;
            }
            $t = fgetc($handle);
            $pos--;
        }
        $line = fgets($handle);
        if ($beginning) {
            // If beginning of file reached, move pointer to the beginning
            fseek($handle, 0);
        }
        // Store the line in an array
        array_unshift($text, $line);
        $line_count++;
    }
    foreach ($text as $t) {
        echo $t . '<br>';
    }
    fclose($handle);
}
*/