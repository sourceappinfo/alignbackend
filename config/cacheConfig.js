const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: process.env.REDIS_DB || 0,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (error) => logger.error(`Redis error: ${error.message}`));

const cache = {
  async set(key, value, expiration = 3600) {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', expiration);
      logger.info(`Cache set for key: ${key}`);
    } catch (error) {
      logger.error(`Error setting cache for key ${key}: ${error.message}`);
    }
  },

  async get(key) {
    try {
      const data = await redisClient.get(key);
      if (data) logger.info(`Cache hit for key: ${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}: ${error.message}`);
      return null;
    }
  },

  async del(key) {
    try {
      await redisClient.del(key);
      logger.info(`Cache deleted for key: ${key}`);
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}: ${error.message}`);
    }
  },
};

module.exports = cache;
