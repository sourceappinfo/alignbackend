const logger = require('../../utils/logger');

describe('Logger Utility', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.silent = false;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    logger.silent = true;
  });

  it('should log an info message', () => {
    const testMessage = 'Test info message';
    logger.info(testMessage);

    expect(consoleLogSpy).toHaveBeenCalled();
    const logCall = consoleLogSpy.mock.calls[0][0];
    expect(logCall).toContain(testMessage);
  });
});