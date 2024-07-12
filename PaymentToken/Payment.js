crypto = require("crypto");

class Helper {
  static SHA256ToString(strJson) {
    const sha256Hash = crypto.createHash("sha256");
    return sha256Hash.update(strJson, "utf8").digest("hex");
  }

  static CreateSignature(payload) {
    const temp = [];
    for (const [key, value] of Object.entries(payload)) {
      temp.push(`${key}=${value}`);
    }
    const joinedPayload = temp.join("&");
    return this.SHA256ToString(joinedPayload);
  }

  async TryAsync4() {
    const transactionTime = new Date().toString();
    const amount = "1";
    const transactionId = "18";
    const tillCode = "4002403";
    const companyName = "Seregela";
    const hashingKey = "x9pBKzQBj45uWWD0w6CZISM0lkg";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA5MTE1NzA2NTIiLCJleHAiOjE3MTEwMDc2Mjd9.WDDei992AZNLU1AQGD33UF2jFdusmDAlIsjKfMiVo50";
    const callbackurl = "https://api.seregelagebeya.com/api/v1/cbe-birr-plus-payment/notify";

    const payload = {
      amount,
      callBackURL: callbackurl,
      companyName,
      key: hashingKey,
      tillCode,
      token,
      transactionId,
      transactionTime,
    };

    const hashedVal = Helper.CreateSignature(payload);

    const finalResponse = {
      amount,
      callBackURL: callbackurl,
      companyName,
      signature: hashedVal,
      tillCode,
      token,
      transactionId,
      transactionTime,
    };
    try {
        const response = await fetch(
          "https://cbebirrpaymentgateway.cbe.com.et:8888/auth/pay",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalResponse),
          }
          
        );
   
        if (response.ok) {
          const responseData = await response.json();
          const paymenttoken = responseData.token;
          console.log(paymenttoken);
          return paymenttoken;
        } else {
          return "Authentication failed: " + response.status;
        }
      } catch (error) {
        return "Error!";
      }
      //console.log(finalResponse);
  }
}

lib = new Helper();
lib.TryAsync4();


