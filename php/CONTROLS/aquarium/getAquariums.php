<?php
// This file is resposnible for returning the aquariums of a user
require_once ($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!empty ($_POST["email"])) {
    $email = $_POST["email"];
    $user = $DAO->selectUserByEmail($email);
    $aquariums = $DAO->selectUserAquariums($user);
    if (count($aquariums) <= 0) {
        $result["error"] = "No aquariums for user! This should never occur...";
    } else {
        foreach ($aquariums as $aq) {
            $result[] = $aq->toJSON();
        }
    }
} else {
    $result["error"] = "GET AQUARIUMS: Missing data!";
}

$jsonResponse = json_encode(["data" => $result]);
echo ($jsonResponse);
die();