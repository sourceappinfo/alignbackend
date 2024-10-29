const { ValidationError } = require('../utils/errorTypes');

const validationMiddleware = async (req, res, next) => {
  try {
    // Add your validation logic here
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Password validation
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { validationMiddleware };
