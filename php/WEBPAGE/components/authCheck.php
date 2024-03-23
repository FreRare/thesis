<?php
session_start();
if ($_SESSION["user"] !== "Admin") {
    header("Location: /WEBPAGE/pages/home.php");
    die();
} else {
    echo ($_SESSION["user"]);
    echo ("<br/>");
    var_dump($_SESSION);
}