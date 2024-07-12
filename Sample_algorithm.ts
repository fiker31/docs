function acceptSelectSchoolPrompt() {

    const toEncryptAmount = CryptoJS.enc.Utf8.parse(totalAmount);

    const toEncryptUserName = CryptoJS.enc.Utf8.parse("Admin");

    const toEncryptPassword = CryptoJS.enc.Utf8.parse("123456");

    const toEncryptTicketNumber = CryptoJS.enc.Utf8.parse("123456");

    const merchantCode = CryptoJS.enc.Utf8.parse(merchantCodeNumber);

    const iv = CryptoJS.lib.WordArray.random(8);

    const securityKeyArray = CryptoJS.MD5(

      CryptoJS.enc.Utf8.parse("b14ca5898a4e4133bbce2ea2315a1916")

    );

    const encryptAmount = CryptoJS.TripleDES.encrypt(

      toEncryptAmount,

      securityKeyArray,

      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, iv }

    );

    const encryptMC = CryptoJS.TripleDES.encrypt(

      merchantCode,

      securityKeyArray,

      {

        mode: CryptoJS.mode.ECB,

        padding: CryptoJS.pad.Pkcs7,

        iv,

      }

    );

    const encryptUserName = CryptoJS.TripleDES.encrypt(

      toEncryptUserName,

      securityKeyArray,

      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, iv }

    );

    const encryptPassword = CryptoJS.TripleDES.encrypt(

      toEncryptPassword,

      securityKeyArray,

      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, iv }

    );

    const encryptTicketNumber = CryptoJS.TripleDES.encrypt(

      toEncryptTicketNumber,

      securityKeyArray,

      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, iv }

    );

    const encryptHashValue = CryptoJS.TripleDES.encrypt(

      hashedValue,

      securityKeyArray,

      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, iv }

    );



    let myReq = {

      A: encryptAmount.toString(),

      U: encryptUserName.toString(),

      W: encryptPassword.toString(),

      T: encryptTicketNumber.toString(),

      MC: encryptMC.toString(),

      HV: encryptHashValue.toString(),

    };

    console.log("my Req: ", myReq);

    let encryptedObj = CryptoJS.TripleDES.encrypt(

      JSON.stringify(myReq),

      securityKeyArray,

      {

        mode: CryptoJS.mode.ECB,

        padding: CryptoJS.pad.Pkcs7,

        iv,

      }

    );

    let r = encryptedObj.toString();



    window.location.href =

      "https://cbebirrpaymentgateway.cbe.com.et:8888/default.aspx?r=" + r;

  }