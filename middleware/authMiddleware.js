const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errorTypes');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('No authorization header');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = authMiddleware;
