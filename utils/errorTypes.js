// utils/errorTypes.js

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

module.exports = {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  InternalServerError
};
