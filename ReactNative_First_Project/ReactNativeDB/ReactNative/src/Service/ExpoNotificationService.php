<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExpoNotificationService
{
    private $httpClient;
    private $expoApiUrl = 'https://exp.host/--/api/v2/push/send';

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function sendNotification($to, $title, $body,$data=null)
    {
        $response = $this->httpClient->request('POST', $this->expoApiUrl, [
            'json' => [
                'to' => $to,
                'title' => $title,
                'body' => $body,
                'data' => $data
            ],
        ]);

        return $response->toArray();
    }
}
