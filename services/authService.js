// services/authService.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { ValidationError, AuthenticationError } = require('../utils/errorTypes');

class AuthService {
  // Register new user
  static async register(userData) {
    try {
      const { email, password, name } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ValidationError('User already exists');
      }

      // Create new user
      const user = await User.create({ email, password, name });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  // Login user
  static async login(email, password) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  // Verify token validity
  static async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ValidationError('User not found');
      }

      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        throw new AuthenticationError('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      logger.error(`Change password error: ${error.message}`);
      throw error;
    }
  }

  // Request password reset
  static async resetPasswordRequest(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ValidationError('No account found with this email');
      }

      const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // In a real application, you would send this token via email
      logger.info(`Password reset token generated for user: ${user._id}`);

      return resetToken;
    } catch (error) {
      logger.error(`Reset password request error: ${error.message}`);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(resetToken, newPassword) {
    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new ValidationError('Invalid reset token');
      }

      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      logger.error(`Reset password error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AuthService;
