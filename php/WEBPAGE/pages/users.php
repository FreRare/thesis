<?php
require ("../components/authCheck.php");
require_once ("../config/daoConfig.php");
$users = $DAO->selectUsers();
?>

<html>
<header>

    <style>
    <?php include ("../css/tables.css");
    require ("../css/all.css");
    ?>
    </style>
    <h1>Users page</h1>
    <?php
    include ("../components/menubar.php");
    ?>
</header>

<body>
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
</body>

</html>