const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

async function processCaptcha() {
  try {
    let captchaResponse;

    do {
      // Step 1: Send GET request to get captcha image
      const captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');

      // Step 2: Extract random from the response
      const random = captchaImageResponse.data.random;

      // Step 3: Send GET request to check captcha with the extracted random
      const checkCaptchaResponse = await axios.get(`https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}`);

      captchaResponse = checkCaptchaResponse.data;

    } while (captchaResponse.data === ''); // Repeat until 'data' field is not empty

    // Return the response to the user
    return captchaResponse;
  } catch (error) {
    console.error(error);
    throw new Error('Error processing captcha');
  }
}

app.get('/getUserCaptcha', async (req, res) => {
  try {
    // Call the processCaptcha function to handle the entire process
    const captchaResponse = await processCaptcha();

    // Return the final response to the user
    res.json(captchaResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
