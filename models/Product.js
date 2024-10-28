const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  labels: [String], // Array of labels to match with Google Vision results
  description: String,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
