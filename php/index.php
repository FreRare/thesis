<?php
echo ("Server welcome!" . "</br>");
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ONLY UNCOMMENT IF YOU WANT TO RE-INITIALIZE DATABASE, IT DROPS ALL TABLES
// 
// ! require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/dbInit.php');
// 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// $userRes = $DAO->createAquarium(new Aquarium(0, "My first aquarium", 60, 30, 30, 12));
// $config = $DAO->createAQConfig(new AquariumConfig(1));
$user = $DAO->selectSensorSamplesForAquarium(1, false);
foreach ($user as $u) {
    echo ($u->toJSON());
    echo ("</br>");
}
?>