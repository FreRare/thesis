<?php
/*
This file is responsble for updating user
Expects user data as json trough $POST
*/
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!empty($_POST["email"]) && !empty($_POST["newMail"]) && !empty($_POST["firstName"]) && !empty($_POST["lastName"])) {
    $email = $_POST["email"];
    $newEmail = $_POST["newEmail"];
    $firstName = $_POST["firstName"];
    $lastName = $_POST["lastName"];

    $user = $DAO->selectUserByEmail($email); // Get user with email to know who to update

    $password = $user->getPassword();   // Get necessary data from existing, these shouldn't be changed here
    $deviceToken = $user->getDeviceToken();
    $authToken = $user->getAuthToken();

    $updatedUser = new User($newEmail, $password, $firstName, $lastName, $deviceToken, $authToken);
    $res = $DAO->updateUser($updatedUser, $email);
    if (!$res) {
        $result["error"] = "Error while updating!";
    } else {
        $result["result"] = "Successfully updated!";
    }
} else {
    $result["error"] = "Missing data!";
}

$responseJson = json_encode(["data" => $result]);
echo ($responseJson);
die();