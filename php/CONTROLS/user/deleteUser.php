<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (isset($_POST["email"])) {
    $email = $_POST["email"];
    $res = $DAO->deleteUser($email);
    if (!$res) {
        $result["error"] = "Error while deleting user!";
    } else {
        $result["success"] = "Successfully deleted!";
    }
} else {
    $result["error"] = "Missing data!";
}
$responseJson = json_encode(["data" => $result]);
echo ($responseJson);