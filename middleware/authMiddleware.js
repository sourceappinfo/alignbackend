// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { formatErrorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json(formatErrorResponse('Unauthorized: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Optional: Refresh token if near expiry
    const expirationThreshold = 10 * 60; // 10 minutes
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn < expirationThreshold) {
      req.newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    next();
  } catch (error) {
    logger.error(`Auth error: ${error.message}`);
    return res.status(401).json(formatErrorResponse('Unauthorized: Invalid token'));
  }
};

module.exports = authMiddleware;
