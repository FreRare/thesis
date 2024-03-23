<?php
session_start();
$_SESSION["user"] = null;
session_destroy();
header("Location: ../pages/home.php");
die();