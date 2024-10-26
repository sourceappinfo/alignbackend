const { formatSuccessResponse, formatErrorResponse } = require('../../utils/responseFormatter');

describe('Response Formatter', () => {
  it('should format a success response', () => {
    const response = formatSuccessResponse({ data: 'some data' }, 'Operation successful');
    expect(response).toEqual({
      status: 'success',
      message: 'Operation successful',
      data: { data: 'some data' },
    });
  });

  it('should format an error response', () => {
    const response = formatErrorResponse('Operation failed');
    expect(response).toEqual({
      status: 'error',
      message: 'Operation failed',
    });
  });
});
