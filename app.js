// app.js
const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter); // Apply rate limiting to all routes

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/users', require('./routes/user'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/search', require('./routes/search'));
app.use('/api/image-recognition', require('./routes/imageRecognition'));
app.use('/api/surveys', require('./routes/survey'));

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const mongoHealth = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.status(200).json({ status: 'OK', database: mongoHealth });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({ status: 'Error', database: 'disconnected', error: error.message });
    }
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
