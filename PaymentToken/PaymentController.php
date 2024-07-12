<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public static function SHA256ToString($strJson)
    {
        $sha256Hash = hash('sha256', $strJson);

        return $sha256Hash;
    }

    public static function generateTransactionId()
    {
        return Str::uuid()->toString();
    }

    public static function CreateSignature($payload)
    {
        ksort($payload); // Sort the array by key

        $temp = [];

        foreach ($payload as $key => $value) {
            $temp[] = "{$key}={$value}";
        }

        $joinedPayload = implode("&", $temp);

        // dd($joinedPayload);

        return self::SHA256ToString($joinedPayload);
    }

    public function makePayment(Request $request)
    {
        // dd($request->all());

        $transactionTime = date('Y-m-d');

        // dd($request->price);

        $amount = $request->price;

        $transactionId = Self::generateTransactionId();

        $tillCode = "4002403";

        $companyName = "Seregela";

        $hashingKey = "x9pBKzQBj45uWWD0w6CZISM0lkg";

        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA5MTE1NzA2NTIiLCJleHAiOjE3MTEwMDc2Mjd9.WDDei992AZNLU1AQGD33UF2jFdusmDAlIsjKfMiVo50";

        $callbackurl = "https://api.seregelagebeya.com/api/v1/cbe-birr-plus-payment/notify";

        $payload = [
            'token' => $token,
            'callBackURL' => $callbackurl,
            'amount' => $amount,
            'companyName' => $companyName,
            'transactionId' => $transactionId,
            'tillCode' => $tillCode,
            'key' => $hashingKey,
            'transactionTime' => $transactionTime,
        ];

        $hashedVal = Self::CreateSignature($payload);


        $finalResponse = [
            'amount' => $amount,
            'callBackURL' => $callbackurl,
            'companyName' => $companyName,
            'signature' => $hashedVal,
            'tillCode' => $tillCode,
            'token' => $token,
            'transactionId' => $transactionId,
            'transactionTime' => $transactionTime,
        ];

        $finalResponseJsonObject = json_decode(json_encode($finalResponse), false);

        // dd($finalResponseJsonObject);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ])->post('https://cbebirrpaymentgateway.cbe.com.et:8888/auth/pay', $finalResponseJsonObject);

            if ($response->ok()) {
                $responseData = $response->json();
                // dd($responseData);
                $paymenttoken = $responseData['token'];
                // dd($paymenttoken);
                return $paymenttoken;
            } else {
                dd($response);
                return 'Authentication failed: ' . $response->status();
            }
        } catch (\Exception $error) {
            return $error->getMessage();
        }
    }
}
