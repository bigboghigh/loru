const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/processCaptcha', async (req, res) => {
  try {
    let random = null;
    let key = null;
    let password = null;

    while (true) {
      // Send request to first API to get random value
      const captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');
      random = captchaImageResponse.data.data.random;

      // Send request to the second API with the random value
      const checkCaptchaResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}');

      if (checkCaptchaResponse.data.data.data !== null) {
        key = checkCaptchaResponse.data.data.data;
        break;
      }
    }

    // Send post request to cdn-accountset-apply API
    const applyCdnAccountResponse = await axios.post('https://external-api.agilecdn.cloud/user/api/user/cdn-accountset-apply?lang=en_US', {"email":"bajssuus@byom.de","veriCode":${key},"lang":"en","userType":0,"cdnParam":"{\"cdnCacheBehaviorModels\":[{\"cdnCacheBehaviorForwardModel\":{\"cookies\":{\"forward\":\"none\",\"whitelistedNames\":[]},\"headerType\":0,\"headers\":[],\"queryString\":2,\"queryStringCacheKeys\":[]},\"compress\":false,\"defaultTtl\":0,\"fieldLevelEncryptionId\":\"\",\"maxTtl\":31536000,\"minTtl\":0,\"originId\":\"ecaee4e0-b639-11ee-b0c4-db23679837ea-pu.edvin.online\",\"pathPattern\":\"*\",\"smoothStreaming\":false,\"type\":1,\"viewerProtocolPolicy\":\"allow-all\",\"allowedMethods\":3,\"isCacheOptions\":false}],\"cdnCertificateModel\":{\"cdnCertificateId\":\"\",\"minimumProtocolVersion\":\"\",\"sslSupportMethod\":false,\"type\":1,\"cdnConfigId\":\"\",\"id\":\"\"},\"cdnOriginsModels\":[{\"domainName\":\"pu.edvin.online\",\"httpPort\":80,\"httpsPort\":443,\"originCustomHeaders\":[],\"originId\":\"ecaee4e0-b639-11ee-b0c4-db23679837ea-pu.edvin.online\",\"originKeepaliveTimeout\":5,\"originPath\":\"\",\"originProtocolPolicy\":\"match-viewer\",\"originReadTimeout\":30,\"originSslProtocols\":[\"TLSv1\"],\"type\":1,\"originType\":1}],\"comment\":\"\",\"defaultRootObject\":\"\",\"customHostType\":1,\"customHost\":\"\",\"domain\":\"\",\"httpVersion\":\"http2\",\"isIpv6Enabled\":false,\"status\":1,\"type\":1,\"deployStatus\":0,\"platformDomain\":\"\",\"visitRegion\":\"Non-Asia-Pacific\",\"cdnRestrictionModel\":{\"locations\":[\"CN\",\"HK\",\"MO\"],\"restrictionType\":2},\"configModel\":7}"} 
    });

    password = applyCdnAccountResponse.data.data.password;

    // Send post request to login API
    const loginResponse = await axios.post('https://external-api.agilecdn.cloud/user/auth/login', {
      username: 'jsjssjj@byom.de',
      password: password,
      accountNumber: '',
      channel: 86,
      code: '',
      terminal: ''
    });

    // Return the password received from the last API
    res.json({ password: password });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
