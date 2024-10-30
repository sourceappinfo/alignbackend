const cacheService = require('../../services/cacheService');

describe('Cache Service', () => {
  beforeEach(async () => {
    await cacheService.clear();
  });

  it('should set and get data from cache', async () => {
    const testKey = 'testKey';
    const testValue = 'testValue';
    
    await cacheService.set(testKey, testValue);
    const value = await cacheService.get(testKey);
    
    expect(value).toBe(testValue);
  });

  it('should return null for non-existent key', async () => {
    const value = await cacheService.get('nonexistent');
    expect(value).toBeNull();
  });
});