const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let email; // Set the email from frontend when you receive the request

app.get('/processRequest', async (req, res) => {
  try {
    // Step 1: Fetch captchaImage from the first API
    const firstApiResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');
    let random = firstApiResponse.data.data.random

    // Step 2: Check captcha using the second API
    let captchaCheckResponse = await checkCaptcha(random);

    while (captchaCheckResponse.data === null) {
      // If data is still null, fetch a new captcha and repeat the process
      const newFirstApiResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');
      random = newFirstApiResponse.data.get('random');
      captchaCheckResponse = await checkCaptcha(random);
    }

    // Step 3: Send post request to apply CDN account set
    const cdnApplyResponse = await axios.post('https://external-api.agilecdn.cloud/user/api/user/cdn-accountset-apply?lang=en_US', {
      email: email,
      veriCode: captchaCheckResponse.data,
      lang: 'en',
      userType: 0,
      cdnParam: {
        // Your CDN parameters here
      }
    });

    const password = cdnApplyResponse.data.get('password');

    // Step 4: Login using the obtained password
    const loginResponse = await axios.post('https://external-api.agilecdn.cloud/user/auth/login', {
      username: email,
      password: password,
      accountNumber: '',
      channel: 86,
      code: '',
      terminal: ''
    });

    res.json(loginResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function checkCaptcha(random) {
  const checkCaptchaUrl = `https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}`;
  return await axios.get(checkCaptchaUrl);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
