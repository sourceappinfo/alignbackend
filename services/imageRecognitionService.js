const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const Product = require('../models/Product'); // Product model to match labels

const analyzeImage = async (imageUrl) => {
  // Sends the image to Google Vision for label detection
  const [result] = await client.labelDetection(imageUrl);
  const labels = result.labelAnnotations.map(label => label.description);

  // Match labels to products in the database
  const products = await Product.find({ labels: { $in: labels } });

  return products.length > 0 ? products : { message: 'No matching products found' };
};

module.exports = {
  analyzeImage,
};
