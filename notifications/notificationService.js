// notifications/notificationService.js
const User = require('../models/User');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const notificationService = {
  async sendNotification(userId, message) {
    try {
      await Notification.create({ userId, message });
      logger.info(`Notification sent to user ${userId}: ${message}`);
    } catch (error) {
      logger.error('Failed to send notification', error);
      throw new Error('Notification sending failed');
    }
  },

  async getNotifications(userId) {
    try {
      return await Notification.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Failed to retrieve notifications', error);
      throw new Error('Could not retrieve notifications');
    }
  },
};

module.exports = notificationService;
