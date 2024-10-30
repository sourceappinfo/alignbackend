const Notification = require('../models/Notification');
const User = require('../models/User');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errorTypes');

class NotificationService {
  static async sendNotification(userId, message, title = 'New Notification', type = 'info') {
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new ValidationError('User not found');
      }

      const notification = await Notification.create({
        userId,
        message,
        title,
        type,
        read: false
      });

      // Invalidate user's notification cache
      await this.invalidateUserCache(userId);

      // In a real application, you might want to emit a websocket event here
      // this.emitNotification(userId, notification);

      return notification;
    } catch (error) {
      logger.error(`Notification creation error: ${error.message}`);
      throw error;
    }
  }

  static async getNotifications(userId, options = {}) {
    try {
      const { page = 1, limit = 10, unreadOnly = false } = options;
      const skip = (page - 1) * limit;

      // Try to get from cache for first page of all notifications
      if (page === 1 && !unreadOnly) {
        const cacheKey = `notifications:${userId}:${limit}`;
        const cachedNotifications = await cacheService.get(cacheKey);
        if (cachedNotifications) {
          return cachedNotifications;
        }
      }

      const query = { userId };
      if (unreadOnly) {
        query.read = false;
      }

      const [notifications, total] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments(query)
      ]);

      const result = {
        notifications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: notifications.length,
          totalRecords: total
        }
      };

      // Cache only first page of all notifications
      if (page === 1 && !unreadOnly) {
        const cacheKey = `notifications:${userId}:${limit}`;
        await cacheService.set(cacheKey, result, 300); // Cache for 5 minutes
      }

      return result;
    } catch (error) {
      logger.error(`Notifications retrieval error: ${error.message}`);
      throw error;
    }
  }

  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { $set: { read: true } },
        { new: true }
      );

      if (!notification) {
        throw new ValidationError('Notification not found or unauthorized');
      }

      await this.invalidateUserCache(userId);
      return notification;
    } catch (error) {
      logger.error(`Mark as read error: ${error.message}`);
      throw error;
    }
  }

  static async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true } }
      );

      await this.invalidateUserCache(userId);
      return true;
    } catch (error) {
      logger.error(`Mark all as read error: ${error.message}`);
      throw error;
    }
  }

  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new ValidationError('Notification not found or unauthorized');
      }

      await this.invalidateUserCache(userId);
      return true;
    } catch (error) {
      logger.error(`Notification deletion error: ${error.message}`);
      throw error;
    }
  }

  static async getUnreadCount(userId) {
    try {
      const cacheKey = `notifications:unread:${userId}`;
      const cachedCount = await cacheService.get(cacheKey);
      if (cachedCount !== null) {
        return cachedCount;
      }

      const count = await Notification.countDocuments({
        userId,
        read: false
      });

      await cacheService.set(cacheKey, count, 60); // Cache for 1 minute
      return count;
    } catch (error) {
      logger.error(`Unread count error: ${error.message}`);
      throw error;
    }
  }

  static async invalidateUserCache(userId) {
    try {
      await Promise.all([
        cacheService.del(`notifications:${userId}:*`),
        cacheService.del(`notifications:unread:${userId}`)
      ]);
    } catch (error) {
      logger.error(`Cache invalidation error: ${error.message}`);
    }
  }
}

module.exports = NotificationService;