const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const redis = require('redis');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Connect to the database
connectDB();

// Redis configuration (optional, if needed for caching)
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (err) => logger.error(`Redis error: ${err}`));

// Middleware to parse JSON
app.use(express.json());

// Apply rate limiting middleware
app.use(rateLimiter);

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/users', require('./routes/user'));
app.use('/api/search', require('./routes/search'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/image-recognition', require('./routes/imageRecognition'));

// Health check route to ensure the server is running
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', database: 'connected' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Define a port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
