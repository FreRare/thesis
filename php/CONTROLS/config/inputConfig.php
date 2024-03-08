<?php
// ! THIS IS HOW WE ACCESS POST DATA FROM REACT NATIVE, $_POST IS NOT WORKING IN GENERAL
$_POST = json_decode(file_get_contents("php://input"), true);
$result = [];