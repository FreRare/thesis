<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/config/controlConfig.php"); // config
require_once($_SERVER["DOCUMENT_ROOT"] . "/CONTROLS/notification/NotificationControl.php"); // controller
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/models/SystemStatus.php"); // status enum (array)

/**
 * Handles the incoming notification requests and sends out the notification to the user's app
 */

foreach ($_POST as $key => $val) {
    error_log("POST content: $key => $val");
}

if (!isset($_POST)) {
    error_log("ERROR: No posted data!");
} else {
    if (!isset($_POST["id"]) || !isset($_POST["status"])) {
        error_log("ERROR: Missing data!");
    } else {
        // We can proceed to notification handling
        $systemId = $_POST["id"];
        $status = $_POST["status"];
        $user = $DAO->selectUserForAquarium($systemId);
        $NC = new NotificationControl($user->getDeviceToken());

        $notificationContent = "ERROR [default message]";
        // Determine the notification content //! Make sure to update this switch in case of changes made to the statuses
        switch ($status) {
            case 1:
                $notificationContent = NotificationControl::MSG_LOW_TEMP;
                break;
            case 2:
                $notificationContent = NotificationControl::MSG_HIGH_TEMP;
                break;
            case 3:
                $notificationContent = NotificationControl::MSG_LOW_PH;
                break;
            case 4:
                $notificationContent = NotificationControl::MSG_HIGH_PH;
                break;
            case 5:
                $notificationContent = NotificationControl::MSG_LOW_WATER_LEVEL;
                break;
            case 13:
                $notificationContent = NotificationControl::MSG_SAMPLE_ERROR;
                break;
            case 14:
                $notificationContent = NotificationControl::MSG_BROKEN_LIGHT;
                break;
            case 255:
                $notificationContent = NotificationControl::MSG_ERROR;
                break;
        }
        // Sending message to client
        $NC->send($notificationContent);
    }
}