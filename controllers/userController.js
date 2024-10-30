// controllers/userController.js
const User = require('../models/User');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errorTypes');

class UserController {
  static async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .lean();

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      return res.status(200).json(
        formatSuccessResponse('User profile retrieved successfully', user)
      );
    } catch (error) {
      logger.error(`Profile retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve user profile')
      );
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const allowedUpdates = ['name', 'email', 'preferences'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json(
          formatErrorResponse('Invalid updates')
        );
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      updates.forEach(update => user[update] = req.body[update]);
      await user.save();

      return res.status(200).json(
        formatSuccessResponse('Profile updated successfully', user)
      );
    } catch (error) {
      logger.error(`Profile update error: ${error.message}`);
      
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrorResponse(error.message));
      }
      
      return res.status(500).json(
        formatErrorResponse('Failed to update profile')
      );
    }
  }

  static async deleteUserProfile(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user.id);

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      return res.status(200).json(
        formatSuccessResponse('Profile deleted successfully')
      );
    } catch (error) {
      logger.error(`Profile deletion error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to delete profile')
      );
    }
  }

  static async updateUserPreferences(req, res) {
    try {
      const { notifications, theme } = req.body;
      
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      if (notifications) {
        user.preferences.notifications = {
          ...user.preferences.notifications,
          ...notifications
        };
      }

      if (theme) {
        user.preferences.theme = theme;
      }

      await user.save();

      return res.status(200).json(
        formatSuccessResponse('Preferences updated successfully', user.preferences)
      );
    } catch (error) {
      logger.error(`Preferences update error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to update preferences')
      );
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id)
        .select('-password -preferences -lastLogin')
        .lean();

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      return res.status(200).json(
        formatSuccessResponse('User retrieved successfully', user)
      );
    } catch (error) {
      logger.error(`User retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve user')
      );
    }
  }

  static async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-password -preferences -lastLogin')
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments();

      return res.status(200).json(
        formatSuccessResponse('Users retrieved successfully', {
          users,
          pagination: {
            current: page,
            total: Math.ceil(total / limit),
            count: users.length,
            totalRecords: total
          }
        })
      );
    } catch (error) {
      logger.error(`Users retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve users')
      );
    }
  }

  static async deactivateUser(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json(
          formatErrorResponse('User not found')
        );
      }

      user.isActive = false;
      await user.save();

      return res.status(200).json(
        formatSuccessResponse('User deactivated successfully')
      );
    } catch (error) {
      logger.error(`User deactivation error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to deactivate user')
      );
    }
  }
}

module.exports = UserController;