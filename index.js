const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

async function getCaptcha() {
  try {
    // Step 1: Send GET request to get captcha image
    const captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');

    // Step 2: Extract random from the response
    const random = captchaImageResponse.data.random;

    // Step 3: Send GET request to check captcha with the extracted random
    const checkCaptchaResponse = await axios.get(`https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}`);

    // Step 4: Check if data is null in the second API response
    if (checkCaptchaResponse.data.data.data === null) {
      // If null, recursively call getCaptcha to retry the process
      return getCaptcha();
    }

    // Step 5: Return the response to the user
    return checkCaptchaResponse.data;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

app.get('/getUserCaptcha', async (req, res) => {
  try {
    const finalResponse = await getCaptcha();
    res.json(finalResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
