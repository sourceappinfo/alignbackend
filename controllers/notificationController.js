const NotificationService = require('../services/notificationService');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

class NotificationController {
  static async createNotification(req, res) {
    try {
      const { userId, message, title, type = 'info' } = req.body;

      if (!userId || !message) {
        return res.status(400).json(
          formatErrorResponse('User ID and message are required')
        );
      }

      const notification = await NotificationService.sendNotification(
        userId,
        message,
        title,
        type
      );

      return res.status(201).json(
        formatSuccessResponse('Notification created successfully', notification)
      );
    } catch (error) {
      logger.error(`Notification creation error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to create notification')
      );
    }
  }

  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, unreadOnly = false } = req.query;

      const notifications = await NotificationService.getNotifications(
        userId,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          unreadOnly: unreadOnly === 'true'
        }
      );

      return res.status(200).json(
        formatSuccessResponse('Notifications retrieved successfully', notifications)
      );
    } catch (error) {
      logger.error(`Notifications retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve notifications')
      );
    }
  }

  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsRead(notificationId, userId);

      if (!notification) {
        return res.status(404).json(
          formatErrorResponse('Notification not found')
        );
      }

      return res.status(200).json(
        formatSuccessResponse('Notification marked as read', notification)
      );
    } catch (error) {
      logger.error(`Mark as read error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to mark notification as read')
      );
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await NotificationService.markAllAsRead(userId);

      return res.status(200).json(
        formatSuccessResponse('All notifications marked as read')
      );
    } catch (error) {
      logger.error(`Mark all as read error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to mark notifications as read')
      );
    }
  }

  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      await NotificationService.deleteNotification(notificationId, userId);

      return res.status(200).json(
        formatSuccessResponse('Notification deleted successfully')
      );
    } catch (error) {
      logger.error(`Notification deletion error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to delete notification')
      );
    }
  }

  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await NotificationService.getUnreadCount(userId);

      return res.status(200).json(
        formatSuccessResponse('Unread count retrieved successfully', { count })
      );
    } catch (error) {
      logger.error(`Unread count retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to get unread count')
      );
    }
  }
}

module.exports = NotificationController;