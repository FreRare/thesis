<?php
require ("../components/authCheck.php");
require_once ("../config/daoConfig.php");
$users = $DAO->selectUsers();
?>

<html>

<head>
    <?php
    include ("../components/menubar.php");
    ?>
    <h1>Users page</h1>
</head>
<main>
    <table>
        <tr>
            <th>ID</th>
            <th>Email</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Device token (notifications)</th>
            <th>Active</th>
            <th></th>
        </tr>
        <?php
        foreach ($users as $u) {
            echo ("<tr>");
            echo ("<td>");
            echo ($u->getId());
            echo ("</td>");
            echo ("<td>");
            echo ($u->getEmail());
            echo ("</td>");
            echo ("<td>");
            echo ($u->getFirstName());
            echo ("</td>");
            echo ("<td>");
            echo ($u->getLastName());
            echo ("</td>");
            echo ("<td>");
            echo ($u->getDeviceToken());
            echo ("</td>");
            echo ("<td>");
            echo ($u->isInactive() ? "FALSE" : "TRUE");
            echo ("</td>");
            echo ("<td>");
            echo ("<button>Delete</button>");
            echo ("</td>");
            echo ("</tr>");
        }
        ?>
    </table>
</main>

</html>