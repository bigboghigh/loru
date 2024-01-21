const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

async function getCaptchaResponse() {
  try {
    // Step 1: Send GET request to get captcha image
    const captchaImageResponse = await axios.get('https://external-api.agilecdn.cloud/user/api/user/captchaImage');

    // Step 2: Extract random from the response
    const random = captchaImageResponse.data.random;

    // Step 3: Send GET request to check captcha with the extracted random
    const checkCaptchaResponse = await axios.get(`https://external-api.agilecdn.cloud/user/api/user/checkCaptcha?point=84&random=${random}`);

    // Check if response.data.data.data is None
    if (checkCaptchaResponse.data.data.data === null) {
      // If None, recursively call the function to try again
      return getCaptchaResponse();
    }

    // Return the response if a valid value is obtained
    return checkCaptchaResponse.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error during captcha validation');
  }
}

app.get('/getUserCaptcha', async (req, res) => {
  try {
    // Get captcha response with retry logic
    const finalResponse = await getCaptchaResponse();

    // Return the final response to the user
    res.json(finalResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
