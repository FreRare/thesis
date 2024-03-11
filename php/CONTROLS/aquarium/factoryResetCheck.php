<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!isset($_POST["id"])) {
    $result['error'] = "No data posted!";
    error_log("No posted data");
} else {
    $id = $_POST["id"];
    $aq = $DAO->selectAquariumById($id);
    if ($aq == null) {
        error_log("Aquarium not found, means it's inactive. Initializing factory reset...");
        echo ("Delete");
    } else {
        die();
    }
}