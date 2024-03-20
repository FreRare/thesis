<?php
require_once ($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

if (isset ($_POST["email"])) {
    $email = $_POST["email"];
    $u = $DAO->selectUserByEmail($email);
    if ($u == null) {
        error_log("No user found to delete with email address: " . $email);
    } else {
        $res = $DAO->deleteUser($u->getId());
        if (!$res) {
            $result["error"] = "Error while deleting user!";
        } else {
            $result["success"] = "Successfully deleted!";
        }
    }
} else {
    $result["error"] = "Missing data!";
}
$responseJson = json_encode(["data" => $result]);
echo ($responseJson);