// utils/errorTypes.js

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
      super(message, 400);
    }
  }
  
  class AuthenticationError extends AppError {
    constructor(message = 'Authentication Error') {
      super(message, 401);
    }
  }
  
  class AuthorizationError extends AppError {
    constructor(message = 'Authorization Error') {
      super(message, 403);
    }
  }
  
  module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
  };
  