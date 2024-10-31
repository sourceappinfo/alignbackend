// tests/services/cacheService.test.js
const cacheService = require('../../services/cacheService');
const Redis = require('ioredis-mock');

describe('Cache Service', () => {
  beforeEach(async () => {
    // Replace Redis client with mock for testing
    cacheService.client = new Redis();
    await cacheService.clear();
  });

  afterEach(async () => {
    await cacheService.clear();
  });

  afterAll(async () => {
    await cacheService.disconnect();
  });

  describe('Basic Operations', () => {
    it('should set and get data from cache', async () => {
      const testKey = 'testKey';
      const testValue = 'testValue';
      
      const setResult = await cacheService.set(testKey, testValue);
      expect(setResult).toBe(true);

      const value = await cacheService.get(testKey);
      expect(value).toBe(testValue);
    });

    it('should return null for non-existent key', async () => {
      const value = await cacheService.get('nonexistent');
      expect(value).toBeNull();
    });

    it('should delete data from cache', async () => {
      const testKey = 'testDelete';
      const testValue = 'deleteValue';

      await cacheService.set(testKey, testValue);
      const deleteResult = await cacheService.del(testKey);
      expect(deleteResult).toBe(true);

      const value = await cacheService.get(testKey);
      expect(value).toBeNull();
    });

    it('should clear all data from cache', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');

      const clearResult = await cacheService.clear();
      expect(clearResult).toBe(true);

      const value1 = await cacheService.get('key1');
      const value2 = await cacheService.get('key2');
      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });
  });

  describe('Advanced Operations', () => {
    it('should handle cache expiration', async () => {
      const testKey = 'expiringKey';
      const testValue = 'expiringValue';
      const ttl = 1; // 1 second

      await cacheService.set(testKey, testValue, ttl);
      const immediateValue = await cacheService.get(testKey);
      expect(immediateValue).toBe(testValue);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const expiredValue = await cacheService.get(testKey);
      expect(expiredValue).toBeNull();
    });

    it('should check if key exists', async () => {
      const testKey = 'existingKey';
      await cacheService.set(testKey, 'someValue');

      const exists = await cacheService.exists(testKey);
      expect(exists).toBe(1);

      const nonExistentKey = await cacheService.exists('nonexistent');
      expect(nonExistentKey).toBe(0);
    });

    it('should increment numeric values', async () => {
      const testKey = 'counter';
      
      // Set initial value as string '0'
      await cacheService.client.set(testKey, '0');

      const result1 = await cacheService.increment(testKey);
      expect(result1).toBe(1);

      const result2 = await cacheService.increment(testKey);
      expect(result2).toBe(2);
    });

    it('should initialize counter before incrementing', async () => {
      const testKey = 'newCounter';
      
      const result = await cacheService.increment(testKey);
      expect(result).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully when setting invalid data', async () => {
      const invalidValue = { circular: {} };
      invalidValue.circular.circular = invalidValue; // Create circular reference

      const setResult = await cacheService.set('invalid', invalidValue);
      expect(setResult).toBe(false);
    });

    it('should handle errors gracefully when getting invalid data', async () => {
      await cacheService.client.set('invalid', 'invalid{json');
      
      const value = await cacheService.get('invalid');
      expect(value).toBeNull();
    });

    it('should handle connection errors gracefully', async () => {
      const originalClient = cacheService.client;
      
      // Replace client with one that will fail
      cacheService.client = {
        set: jest.fn().mockRejectedValue(new Error('Connection failed')),
        quit: jest.fn()
      };

      const result = await cacheService.set('test', 'value');
      expect(result).toBe(false);

      // Restore original client
      cacheService.client = originalClient;
    });
  });

  describe('Complex Data Types', () => {
    it('should handle objects', async () => {
      const testObject = { name: 'test', value: 123 };
      await cacheService.set('object', testObject);
      
      const result = await cacheService.get('object');
      expect(result).toEqual(testObject);
    });

    it('should handle arrays', async () => {
      const testArray = [1, 2, 3, 'test'];
      await cacheService.set('array', testArray);
      
      const result = await cacheService.get('array');
      expect(result).toEqual(testArray);
    });

    it('should handle nested structures', async () => {
      const testNested = {
        name: 'test',
        data: {
          values: [1, 2, 3],
          metadata: {
            created: new Date().toISOString()
          }
        }
      };
      
      await cacheService.set('nested', testNested);
      const result = await cacheService.get('nested');
      expect(result).toEqual(testNested);
    });
  });

  describe('TTL Operations', () => {
    it('should set and respect TTL', async () => {
      const testKey = 'ttlTest';
      const testValue = 'ttlValue';
      
      await cacheService.set(testKey, testValue, 1);
      expect(await cacheService.get(testKey)).toBe(testValue);
      
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(await cacheService.get(testKey)).toBeNull();
    });

    it('should update TTL on existing key', async () => {
      const testKey = 'updateTTL';
      await cacheService.set(testKey, 'value');
      
      const success = await cacheService.expire(testKey, 1);
      expect(success).toBe(1);
      
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(await cacheService.get(testKey)).toBeNull();
    });
  });
});