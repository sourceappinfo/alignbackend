// server.js
require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const { connectDB } = require('./config/db');

// Verify essential environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        logger.error(`Environment variable ${key} is missing.`);
        process.exit(1);
    }
});

// Connect to database if not in test environment
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
        await server.close();
        logger.info('Server closed successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
