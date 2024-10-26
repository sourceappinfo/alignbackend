const logger = require('../../utils/logger');

describe('Logger Utility', () => {
  it('should log an info message', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    logger.info('Test info message');
    expect(consoleSpy).toHaveBeenCalledWith('INFO: Test info message');
    consoleSpy.mockRestore();
  });
});
