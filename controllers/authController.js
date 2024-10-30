const AuthService = require('../services/authService');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ValidationError, AuthenticationError } = require('../utils/errorTypes');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json(
          formatErrorResponse('Email and password are required')
        );
      }

      const result = await AuthService.register({ email, password, name });
      
      return res.status(201).json(
        formatSuccessResponse('Registration successful', result)
      );
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrorResponse(error.message));
      }
      
      return res.status(500).json(
        formatErrorResponse('Registration failed')
      );
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(
          formatErrorResponse('Email and password are required')
        );
      }

      const result = await AuthService.login(email, password);
      
      return res.status(200).json(
        formatSuccessResponse('Login successful', result)
      );
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      
      if (error instanceof AuthenticationError) {
        return res.status(401).json(formatErrorResponse(error.message));
      }
      
      return res.status(500).json(
        formatErrorResponse('Login failed')
      );
    }
  }

  static async verifyToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json(
          formatErrorResponse('Token is required')
        );
      }

      const decoded = await AuthService.verifyToken(token);
      
      return res.status(200).json(
        formatSuccessResponse('Token is valid', decoded)
      );
    } catch (error) {
      logger.error(`Token verification error: ${error.message}`);
      return res.status(401).json(
        formatErrorResponse('Invalid or expired token')
      );
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json(
          formatErrorResponse('Current and new password are required')
        );
      }

      await AuthService.changePassword(userId, currentPassword, newPassword);
      
      return res.status(200).json(
        formatSuccessResponse('Password changed successfully')
      );
    } catch (error) {
      logger.error(`Password change error: ${error.message}`);
      
      if (error instanceof AuthenticationError) {
        return res.status(401).json(formatErrorResponse(error.message));
      }
      
      return res.status(500).json(
        formatErrorResponse('Password change failed')
      );
    }
  }

  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json(
          formatErrorResponse('Email is required')
        );
      }

      const resetToken = await AuthService.resetPasswordRequest(email);
      
      return res.status(200).json(
        formatSuccessResponse('Password reset email sent', { resetToken })
      );
    } catch (error) {
      logger.error(`Password reset request error: ${error.message}`);
      
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrorResponse(error.message));
      }
      
      return res.status(500).json(
        formatErrorResponse('Password reset request failed')
      );
    }
  }

  static async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json(
          formatErrorResponse('Reset token and new password are required')
        );
      }

      await AuthService.resetPassword(resetToken, newPassword);
      
      return res.status(200).json(
        formatSuccessResponse('Password reset successful')
      );
    } catch (error) {
      logger.error(`Password reset error: ${error.message}`);
      
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrorResponse(error.message));
      }
      
      return res.status(500).json(
        formatErrorResponse('Password reset failed')
      );
    }
  }

  static async logout(req, res) {
    try {
      // In a real application, you might want to invalidate the token
      // or remove it from a whitelist/database
      return res.status(200).json(
        formatSuccessResponse('Logout successful')
      );
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Logout failed')
      );
    }
  }
}

module.exports = AuthController;