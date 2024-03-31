<?php
require ("../components/authCheck.php");

$numRows = 100;

if (isset($_POST['refresh'])) {
    $numRows = $_POST["log_rows"];
}

$logContent = [];
$logFilePath = '../../LOG/atc-log.log';
$logFile = fopen($logFilePath, 'r');
$pos = -strlen(PHP_EOL) - 1;
if (flock($logFile, LOCK_EX)) {
    $currentLine = '';
    $lineCnt = 1;
    while (-1 !== fseek($logFile, $pos, SEEK_END) && $lineCnt <= $numRows) {
        $char = fgetc($logFile);
        if ($char === '<' || $char === '>') {
            $char = '|';
        }
        if (PHP_EOL == $char) {
            $logContent[] = $currentLine;
            $lineCnt++;
            $currentLine = '';
        } else {
            $currentLine = $char . $currentLine;
        }
        $pos--;
    }
    flock($logFile, LOCK_UN);
} else {
    echo ("<strong>Unable to lock file!</strong>");
}
fclose($logFile);
?>

<html>
<header>
    <style>
    <?php include ("../css/logView.css");
    include ("../css/tables.css");
    require ("../css/all.css");
    ?>
    </style>
    <div class='title'>
        <h1>LOG view page</h1>
    </div>
    <?php
    include ("../components/menubar.php");
    ?>
</header>

<body>
    <div class='action'>
        <?php echo ("<p>Select how many lines to display. Currently showing $numRows lines.</p>") ?>
        <form id='rowsForm' method='POST' action="./logView.php">
            <select name='log_rows'>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
            <button type='submit' name='refresh'>Refresh</button>
        </form>
    </div>
    <main>
        <div id='logDiv'>
            <table id='logViewTable'>
                <tr>
                    <th>System ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Message type</th>
                    <th>Status code</th>
                    <th>Message</th>
                </tr>
                <?php
                foreach ($logContent as $l) {
                    $log = explode('ATC/LOG', $l);
                    $logDateTime = explode(' ', trim($log[0]));
                    $logDate = $logDateTime[0];
                    $logTime = explode('.', $logDateTime[1])[0];
                    $logData = trim($log[1]);
                    $logSystem = explode(' ', trim(explode('|', $logData)[1]))[1];
                    // We have only 2 types of messages, handlig status or error
                    $logMessageType = strpos(explode(':', explode('|', $logData)[3])[0], 'status') ? "Status" : "Error";
                    $logMessage = '';
                    $logStatus = '';
                    $logStatusStr = '';
                    if ($logMessageType === 'Status') {
                        $logMessage = explode('===', trim(explode(':', trim(explode('|', $logData)[3]))[1]));
                        $logStatus = trim($logMessage[0]);
                        $logStatusStr = trim($logMessage[1]);
                    } else {
                        // TODO: Finish error cropping
                        $logMessage = trim($logData);
                    }

                    $class = 'trEven';
                    if (array_search($l, $logContent) && array_search($l, $logContent) % 2 === 1) {
                        $class = 'trOdd';
                    }
                    if ($logStatus === 'Error') {
                        $class = 'trError';
                    }

                    echo ("<tr class=$class>");
                    echo ("<td>" . $logSystem . "</td>");
                    echo ("<td>" . $logDate . "</td>");
                    echo ("<td>" . $logTime . "</td>");
                    echo ("<td>" . $logMessageType . "</td>");
                    echo ("<td>" . $logStatus . "</td>");
                    echo ("<td>" . $logStatusStr . "</td>");
                    echo ("</tr>");
                }
                ?>
            </table>
        </div>
    </main>
</body>

</html>