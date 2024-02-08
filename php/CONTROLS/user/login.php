<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

$keys = ["email", "password"];

foreach ($keys as $key) {
    if (!isset($_POST[$key])) {
        $result["error"] = "Missing data with key: " . $key;
    }
}

// If we have all
if (!isset($result["error"])) {
    // Exportnig vars
    $email = $_POST["email"];
    $password = $_POST["password"];
    $hashedPass = hash("sha256", $password);
    // Try to find user with given email
    $tryUser = $DAO->selectUserByEmail($email); // Trying to get user by email provided
    // If we didn't find user or password is incorrect
    if (!isset($tryUser) || $tryUser->getPassword() !== $hashedPass) {
        error_log("No user or invalid password!" . $tryUser->toJSON());
        $response["error"] = "Invalid email address or password!";
    } else {
        // If found user and password matches set response to the user
        $response = $tryUser->toJSON();
        // IF we have a new token set
        if (isset($_POST["token"])) {
            $newToken = $_POST["token"];
            error_log("Updating user's [$email] device token for: $newToken");
            $tryUser->setDeviceToken($newToken);
            $res = $DAO->updateUser($tryUser, $tryUser->getEmail());
            if (!$res) {
                $response["error"] = "Error while updating push-token!";
            }
        }
    }
}
// Making valid json from the response
$responseJson = json_encode(["data" => $response]);
header("Content-Type: application/json");
echo ($responseJson);