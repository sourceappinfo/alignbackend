// config/db.js

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (uri = process.env.MONGO_URI) => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    if (process.env.NODE_ENV === 'test') {
      logger.info('Running in test mode; using MongoMemoryServer.');
      return;
    }

    const conn = await mongoose.connect(uri, options);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      setTimeout(() => connectDB(uri), 5000);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info('MongoDB disconnected');
    }
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDB, disconnectDB };