<?php
require_once ($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAO.php");
$DAO = AQDAO::getInstance();

if (isset ($_POST["username"]) && isset ($_POST["password"])) {
    $uname = $_POST["username"];
    $pass = $_POST["password"];
    if ($uname == "admin" && $pass == "Korm()s0127") {
        session_start();
        $_SESSION["user"] = "Admin";
        header("Location: ../pages/admin.php");
        die();
    } else {
        echo ("Invalid username or password!");
    }
} else {
    echo ("Invalid username or password!");
}