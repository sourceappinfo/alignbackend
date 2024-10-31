const Redis = require('ioredis');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      const RedisMock = require('ioredis-mock');
      this.client = new RedisMock();
    } else {
      this.client = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        lazyConnect: true,
        retryStrategy(times) {
          if (times > 3) {
            return null;
          }
          return Math.min(times * 100, 3000);
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
      });
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (typeof value === 'undefined') {
        return false;
      }
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.client.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      logger.error(`Cache set error: ${error.message}`);
      return false;
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Cache get error: ${error.message}`);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error: ${error.message}`);
      return false;
    }
  }

  async clear(pattern = '*') {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      logger.error(`Cache clear error: ${error.message}`);
      return false;
    }
  }

  async exists(key) {
    try {
      return await this.client.exists(key);
    } catch (error) {
      logger.error(`Cache exists error: ${error.message}`);
      return false;
    }
  }

  async increment(key) {
    try {
      const value = await this.client.get(key);
      if (!value) {
        await this.client.set(key, '0');
      }
      return await this.client.incr(key);
    } catch (error) {
      logger.error(`Cache increment error: ${error.message}`);
      return null;
    }
  }

  async expire(key, seconds) {
    try {
      return await this.client.expire(key, seconds);
    } catch (error) {
      logger.error(`Cache expire error: ${error.message}`);
      return false;
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
      logger.info('Redis client disconnected');
      return true;
    } catch (error) {
      logger.error(`Redis disconnect error: ${error.message}`);
      return false;
    }
  }
}

module.exports = new CacheService();
