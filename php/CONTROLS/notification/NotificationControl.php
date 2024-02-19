<?php
class NotificationControl
{
    const EXPO_NOTIFICATION_SERVER = "https://exp.host/--/api/v2/push/send";
    const MSG_LOW_TEMP = "Your aquarium's temperature is lower than your preferred value!";
    const MSG_HIGH_TEMP = "Your aquarium's temperature is higher than your preferred value!";
    const MSG_LOW_PH = "Your aquarium's PH is lower than your preferred value!";
    const MSG_HIGH_PH = "Your aquarium's PH is higher than your preferred value!";
    const MSG_LOW_WATER_LEVEL = "Your aquarium's water level is low! Please refill the missing amout of water!";
    const MSG_BROKEN_LIGHT = "Seems like your aquarium's lamp is broken! The measured light level was lower than expected if the lamp is working good, please check in order to provide the desired amount of light.";
    const MSG_ERROR = "ERROR: An unexpected error has occured! If the error affects the system's work, it will probably reboot. If this doesn't happen please perform a manual restart!";
    const MSG_SAMPLE_ERROR = "ERROR: An unexpected error occured while taking samples! Please make sure that all sensors are set up properly in order to keep monitoring your aquarium without further problems!";
    private $client;
    public function __construct(string $clientToken)
    {
        $this->client = $clientToken;
        error_log("NOTIFICATIONS: Notification controller created for $clientToken");
    }

    public function send(string $notificationContent)
    {
        $payload = array(
            'to' => "$this->client",
            'sound' => "default",
            'body' => $notificationContent,
        );

        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => NotificationControl::EXPO_NOTIFICATION_SERVER,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($payload),
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Accept-Encoding: gzip, deflate",
                    "Content-Type: application/json",
                    "cache-control: no-cache",
                    "host: exp.host"
                ),
            )
        );

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            error_log("cURL Error #:" . $err);
        } else {
            error_log("Notification sent to user [$this->client] === " . $response);
        }
    }
}