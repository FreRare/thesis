<?php
echo('Server welcome!');
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ONLY UNCOMMENT IF YOU WANT TO RE-INITIALIZE DATABASE, IT DROPS ALL TABLES
// 
// require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/dbInit.php');
// 
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
$res = $DAO->selectUserByEmail("abel.takacs@gmail.com");
if($res === null) die("No user!");
echo($res->getEmail() . "</br>");
$res = $DAO->selectAquariumById(2);
if($res === null) die("No aquarium!");
echo($res->getName() . "</br>");*/
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();
// $res = $DAO->__query("DELETE FROM users");
var_dump($res);
?>