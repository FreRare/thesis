<?php
require ("../components/authCheck.php");
require_once ("../config/daoConfig.php");
$aquariums = $DAO->selectAquariums();
?>

<html>
<header>

    <style>
    <?php include ("../css/tables.css");
    require ("../css/all.css");
    ?>
    </style>
    <h1>Aquariums page</h1>
    <?php
    include ("../components/menubar.php");
    ?>
</header>

<body>
    <main>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Length</th>
                <th>Height</th>
                <th>Width</th>
                <th>Number of fish</th>
                <th>Active</th>
                <th></th>
            </tr>
            <?php
            foreach ($aquariums as $u) {
                echo ("<tr>");
                echo ("<td>");
                echo ($u->getId());
                echo ("</td>");
                echo ("<td>");
                echo ($u->getName());
                echo ("</td>");
                echo ("<td>");
                echo ($u->getLength());
                echo ("</td>");
                echo ("<td>");
                echo ($u->getHeight());
                echo ("</td>");
                echo ("<td>");
                echo ($u->getWidth());
                echo ("</td>");
                echo ("<td>");
                echo ($u->getfishCount());
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