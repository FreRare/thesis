<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

/*
Handles the deletion of an aquarium
Expects the aquarium's id as a parameter
Also deletes the user of the aquarium, if this is the user's last one.
*/
if (!empty($_POST["id"])) {
    $id = $_POST["id"];

    // Find the owner
    $owner = $DAO->selectUserForAquarium($id);
    if ($owner == null) {
        error_log("Error: couldn't find user for aquarium with id: $id.. This should never happen!");
        die();
    }
    // Get all his aquariums
    $ownerAquariums = $DAO->selectUserAquariums($owner);
    // If owner has only this aquarium we have to remove the user too
    if (count($ownerAquariums) === 1) {
        $res = $DAO->deleteUser($owner->getEmail());
        if (!$res) {
            $result["error"] = "Error while deleting user!";
        } else {
            $result["result"] = "User deleted successfully!";
        }
    }
    // Delete aquarium anyway
    $res = $DAO->deleteAquarium($id);
    if (!$res) {
        $result["error"] = "Error while deleting!";
    } else {
        $result["result"] = "Successfully deleted!";
    }
} else {
    $result["error"] = "Missing data!";
}

$jsonResponse = json_encode(["data" => $result]);
echo ($jsonResponse);