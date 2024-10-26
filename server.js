// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Connect to the MongoDB database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Apply global rate limiter middleware
app.use(rateLimiter);

// Routes for various API endpoints
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/surveys', require('./routes/survey'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/search', require('./routes/search'));
app.use('/api/notifications', require('./routes/notifications'));

// Global error handler middleware
app.use(errorHandler);

// Define a port from environment or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
