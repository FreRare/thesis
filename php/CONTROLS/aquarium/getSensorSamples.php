<?php
// Send the sensor samples as a json response
// If post has a set 'forHome' flag for true it only sends the last sample
// Expects an id and the flag
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php");

// If both params are set
if (isset($_POST["id"]) && isset($_POST["forHome"])) {

    $id = $_POST["id"];
    $forHomeFlag = $_POST["forHome"];

    if ($forHomeFlag) {
        // In this case we only need the last samples
        $samples = $DAO->selectSensorSamplesForAquarium($id, true);
        if (count($samples) > 0) {
            foreach ($samples as $sample) {
                $result[] = $sample->toJSON();
            }
        } else {
            $result["error"] = "No data found in database!";
        }
    } else {
        // We can get all samples for a month back
        $endDate = new DateTime();
        $startDate = clone $endDate;
        $startDate->modify("-30 days");
        $samples = $DAO->selectSensorSamplesInDateRange($id, $startDate, $endDate);
        if (count($samples) > 0) {
            foreach ($samples as $sample) {
                $result[] = $sample->toJSON();
            }
        } else {
            $result["error"] = "No data found in database!";
        }
    }
} else {
    $result["error"] = "Missing data";
}

$jsonResponse = json_encode(["data" => $result]);
echo ($jsonResponse);