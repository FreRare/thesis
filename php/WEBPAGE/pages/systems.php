<?php
require ("../components/authCheck.php");
require_once ("../config/daoConfig.php");
$aquariums = $DAO->selectAquariums();
?>

<html>

<head>
    <?php
    include ("../components/menubar.php");
    ?>
    <h1>Aquariums page</h1>
</head>
<main>
    <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Length</th>
            <th>Height</th>
            <th>Width</th>
            <th>Number of fish</th>
            <th>Inactive</th>
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

</html>