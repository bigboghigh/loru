const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/getUserCaptcha', async (req, res) => {
  try {
    // Step 1: Send GET request to get captcha image
    const captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');

    // Step 2: Extract random from the response
    const random = captchaImageResponse.data.data.random;

    // Step 3: Send GET request to check captcha with the extracted random
    const checkCaptchaResponse = await axios.get(`https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}`);

    // Step 4: Return the response to the user
    res.json(checkCaptchaResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
