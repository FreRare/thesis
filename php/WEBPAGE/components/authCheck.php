<?php
session_start();
if ($_SESSION["user"] !== "Admin") {
    header("Location: /WEBPAGE/pages/home.php");
    die();
}