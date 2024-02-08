<?php
/*
This is reponsible for updating password
Expects the old and new password plus the user's email in $POST
*/
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!empty($_POST["email"]) && !empty($_POST["oldPass"]) && !empty($_POST["newPass"])) {
    $email = $_POST["email"];
    $password = hash("sha256", $_POST["oldPass"]);
    $newPassword = hash("sha256", $_POST["newPass"]);

    $user = $DAO->selectUserByEmail($email);
    if ($user === null) {
        $result["error"] = "No user found with given email address! This should never occur..";
    } else {
        if ($password === $user->getPassword()) { // Matching password we can change it
            $updatedUser = new User($email, $newPassword, $user->getFirstName(), $user->getLastName(), $user->getDeviceToken());
            $res = $DAO->updateUser($updatedUser, $email);
            if (!$res) {
                $result["error"] = "Error while updating";
            } else {
                $result["result"] = "Succesfully updated!";
            }
        } else {
            $result["error"] = "The provided old password is not valid!";
        }
    }

} else {
    $result["error"] = "Missing data!";
}

$responseJson = json_encode(["data" => $result]);
echo ($responseJson);
die();