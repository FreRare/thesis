<?php

// Performs a login like action (get's user data based on token)
// Used for auto login authorization
require_once ($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (empty($_POST["token"])) {
    $result["error"] = "LOGIN WITH TOKEN: Missing data!";
}

if (!empty($_POST["token"])) {
    $token = $_POST["token"];
    $user = $DAO->selectUserByToken($token);
    if ($user == null) {
        $result["error"] = "No user found with given token!";
    } else {
        $result = $user->toJSON();
    }
}
$jsonResponse = json_encode(["data" => $result]);
echo ($jsonResponse);
die();