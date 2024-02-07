<?php
class NotificationControl
{
    const EXPO_NOTIFICATION_SERVER = "https://exp.host/--/api/v2/push/send";
    private $client;
    public function __construct(string $clientToken)
    {
        $this->client = $clientToken;
        error_log("NOTIFICATIONS: Notification controller created for $clientToken");
    }

    public function send(string $notificationContent)
    {
        $payload = array(
            'to' => "ExponentPushToken[$this->client]",
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
            error_log($response);
        }
    }
}