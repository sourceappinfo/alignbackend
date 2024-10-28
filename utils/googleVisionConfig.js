require('dotenv').config();
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ensure this path points to your Google Vision credentials JSON
});

module.exports = client;
