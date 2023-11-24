<?php
echo ('Server welcome!');
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ONLY UNCOMMENT IF YOU WANT TO RE-INITIALIZE DATABASE, IT DROPS ALL TABLES
// 
// require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/dbInit.php');
// 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
?>