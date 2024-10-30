const cacheService = require('../../services/cacheService');

describe('Cache Service', () => {
  beforeAll(async () => {
    // Reset the cache before all tests
    await cacheService.clear();
  });

  afterAll(async () => {
    // Clean up and disconnect after all tests
    await cacheService.clear();
    await cacheService.disconnect();
  });

  beforeEach(async () => {
    // Clear cache before each test
    await cacheService.clear();
  });

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
    await cacheService.set(testKey, '0');

    const result1 = await cacheService.increment(testKey);
    expect(result1).toBe(1);

    const result2 = await cacheService.increment(testKey);
    expect(result2).toBe(2);
  });

  it('should handle errors gracefully', async () => {
    const invalidValue = { circular: {} };
    invalidValue.circular.circular = invalidValue; // Create circular reference

    const setResult = await cacheService.set('invalid', invalidValue);
    expect(setResult).toBe(false);
  });
});