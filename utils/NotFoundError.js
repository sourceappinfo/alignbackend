// utils/NotFoundError.js

class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError'; // Optional: Set the error name
      this.statusCode = 404; // Set the HTTP status code
    }
  }
  
  module.exports = NotFoundError; // Export the class
  