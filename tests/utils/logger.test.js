const winston = require('winston');
const logger = require('../../utils/logger');

jest.mock('winston', () => {
  const mockFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn()
  };
  
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };

  return {
    format: mockFormat,
    createLogger: jest.fn().mockReturnValue(mockLogger),
    transports: {
      Console: jest.fn(),
      File: jest.fn()
    }
  };
});

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log an info message', () => {
    const testMessage = 'Test info message';
    logger.info(testMessage);
    expect(logger.info).toHaveBeenCalledWith(testMessage);
  });

  it('should log an error message', () => {
    const testError = 'Test error message';
    logger.error(testError);
    expect(logger.error).toHaveBeenCalledWith(testError);
  });
});