<?php
/*
Responsible to handle an aquarium creation from the app
 ! DOES NOT CREATE AN AQUARIUM JUST ADDS IT TO THE CONNECTION TABLE
Expects the aquarium's data and the user's email
 */
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (!empty($_POST["id"]) && !empty($_POST["name"]) && !empty($_POST["length"]) && !empty($_POST["height"]) && !empty($_POST["width"]) && !empty($_POST["width"]) && !empty($_POST["fishCount"]) && !empty($_POST["email"])) {
    $id = $_POST["id"];
    $name = $_POST["name"];
    $length = $_POST["length"];
    $height = $_POST["height"];
    $width = $_POST["width"];
    $fishCount = $_POST["fishCount"];
    $email = $_POST["email"];

    // Check if we have a sytem with given ID
    if ($DAO->selectAquariumById($id) == null) {
        $result["error"] = "The provoded ID does not belong to any ATC system!";
    } else { // We can update aquarium and add it to user
        $aquarium = new Aquarium($id, $name, $length, $height, $width, $fishCount);
        $user = $DAO->selectUserByEmail($email); // Find user for email
        $updateRes = $DAO->updateAquarium($aquarium);        // update aquarium data
        $connectRes = $DAO->createAquariumConnection($user, $aquarium); // Create connection

        if (!$updateRes) {
            $result["error"] = "Error while updating!";
        } else if (!$connectRes) {
            $result["error"] = "Error while adding aqaurium to user!";
        } else {
            $result["result"] = "Successfully created!";
        }
    }
}
$responseJson = json_encode(["data" => $result]);
echo ($responseJson);
die();