const cacheService = require('../../services/cacheService');

describe('Cache Service', () => {
  it('should set and get data from cache', async () => {
    cacheService.set('testKey', 'testValue');
    const value = await cacheService.get('testKey');
    expect(value).toBe('testValue');
  });
});
