const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    let captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');
    let random = captchaImageResponse.data.random;

    let checkCaptchaResponse;
    do {
      checkCaptchaResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}');
      if (checkCaptchaResponse.data.data === null) {
        captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');
        random = captchaImageResponse.data.random;
      }
    } while (checkCaptchaResponse.data.data === null);

    const email = req.query.email; // assuming email is sent as a query parameter
    const key = checkCaptchaResponse.data.data;

    const applyResponse = await axios.post('https://external-api.agilecdn.cloud/user/api/user/cdn-accountset-apply?lang=en_US', {
      email: email,
      veriCode: key,
      lang: 'en',
      userType: 0,
      cdnParam: '{"cdnCacheBehaviorModels":[{"cdnCacheBehaviorForwardModel":{"cookies":{"forward":"none","whitelistedNames":[]},"headerType":0,"headers":[],"queryString":2,"queryStringCacheKeys":[]},"compress":false,"defaultTtl":0,"fieldLevelEncryptionId":"","maxTtl":31536000,"minTtl":0,"originId":"ecaee4e0-b639-11ee-b0c4-db23679837ea-pu.edvin.online","pathPattern":"*","smoothStreaming":false,"type":1,"viewerProtocolPolicy":"allow-all","allowedMethods":3,"isCacheOptions":false}],"cdnCertificateModel":{"cdnCertificateId":"","minimumProtocolVersion":"","sslSupportMethod":false,"type":1,"cdnConfigId":"","id":""},"cdnOriginsModels":[{"domainName":"pu.edvin.online","httpPort":80,"httpsPort":443,"originCustomHeaders":[],"originId":"ecaee4e0-b639-11ee-b0c4-db23679837ea-pu.edvin.online","originKeepaliveTimeout":5,"originPath":"","originProtocolPolicy":"match-viewer","originReadTimeout":30,"originSslProtocols":["TLSv1"],"type":1,"originType":1}],"comment":"","defaultRootObject":"","customHostType":1,"customHost":"","domain":"","httpVersion":"http2","isIpv6Enabled":false,"status":1,"type":1,"deployStatus":0,"platformDomain":"","visitRegion":"Non-Asia-Pacific","cdnRestrictionModel":{"locations":["CN","HK","MO"],"restrictionType":2},"configModel":7}'
    });

    const password = applyResponse.data.password;
    const loginResponse = await axios.post('https://external-api.agilecdn.cloud/user/auth/login', {
      username: email,
      password: password,
      accountNumber: "",
      channel: 86,
      code: "",
      terminal: ""
    });

    return loginResponse.data
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log('Server is running at http://localhost:${port}');
});
