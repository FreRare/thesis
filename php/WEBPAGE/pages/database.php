<?php
require ("../components/authCheck.php");
require_once ("../config/daoConfig.php");
$result = null;
if (isset($_POST["query_input"])) {
    $query = $_POST['query_input'];
    $result = $DAO->__query($query);
}
?>
<html>
<header>
    <style>
        <?php require ("../css/all.css");
        require ("../css/tables.css");
        require ("../css/database.css");
        ?>
    </style>
    <h2>Database editor page</h2>
    <?php include ('../components/menubar.php'); ?>
</header>

<body>
    <main>
        <section class='wrapper'>
            <p>Below you can add SQL queries that will be executed to the database.</p>
            <div class="container">
                <form method="POST" action="./database.php">
                    <textarea class="textAreaInput" name="query_input" placeholder="Add query here..."
                        maxlength="300"></textarea>
                    <button type="submit">Send</button>
                </form>
            </div>
            <div class='wrapper'>
                <?php
                echo ("<strong>Result of query:</strong>");
                if ($result === true) {
                    echo ("<stong>");
                    echo ("Query executed successfully!");
                    echo ("</stong>");
                } else if (gettype($result) === "string") {
                    echo ("<stong>");
                    echo ("Error while executing query! </br> $result");
                    echo ("</stong>");
                } else if ($result instanceof mysqli_result) {
                    $results = [];
                    while ($resRow = $result->fetch_assoc()) {
                        $results[] = $resRow;
                    }
                    echo ("<table>");
                    echo ("<thead>");
                    echo ("<tr>");
                    foreach ($results[0] as $k => $r) {
                        echo ("<th>" . $k . "</th>");
                    }
                    echo ("</tr>");
                    echo ("</thead>");
                    echo ("<tbody>");
                    foreach ($results as $res) {
                        echo ("<tr>");
                        foreach ($res as $k => $r) {
                            echo ("<td>" . $r . "</td>");
                        }
                        echo ("</tr>");
                    }
                    echo ("<tbody>");
                    echo ("</table>");
                }
                ?>
            </div>
        </section>
    </main>
</body>

</html>