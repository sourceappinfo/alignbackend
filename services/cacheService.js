const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

const cacheData = async (key, data, ttl = 3600) => {
  await client.set(key, JSON.stringify(data), 'EX', ttl);
};

const getCachedData = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

module.exports = { cacheData, getCachedData };
