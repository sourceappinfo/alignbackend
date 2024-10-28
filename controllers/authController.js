// controllers/authController.js
const authService = require('../services/authService');
const { formatResponse } = require('../utils/responseFormatter');

exports.register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json(formatResponse('User registered successfully', { user, token }));
  } catch (error) {
    res.status(400).json(formatResponse('Registration failed', null, error.message));
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body.email, req.body.password);
    res.status(200).json(formatResponse('Login successful', { user, token }));
  } catch (error) {
    res.status(401).json(formatResponse('Login failed', null, error.message));
  }
};
