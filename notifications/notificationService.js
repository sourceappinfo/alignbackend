// notifications/notificationService.js
const User = require('../models/User'); // Assuming notifications are tied to users
const Notification = require('../models/Notification'); // Assuming we have a Notification model
const { logger } = require('../utils/logger');

const notificationService = {
  async sendNotification(userId, message) {
    try {
      // Simulating sending the notification (e.g., email, in-app message)
      await Notification.create({ userId, message });
      logger.info(`Notification sent to user ${userId}: ${message}`);
    } catch (error) {
      logger.error('Failed to send notification', error);
      throw new Error('Notification sending failed');
    }
  },

  async getNotifications(userId) {
    try {
      // Fetch all notifications for the user
      return await Notification.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Failed to retrieve notifications', error);
      throw new Error('Could not retrieve notifications');
    }
  },

  async subscribe(userId) {
    try {
      // Subscribe the user to notifications
      await User.findByIdAndUpdate(userId, { isSubscribedToNotifications: true });
      logger.info(`User ${userId} subscribed to notifications`);
    } catch (error) {
      logger.error('Failed to subscribe to notifications', error);
      throw new Error('Subscription failed');
    }
  },

  async unsubscribe(userId) {
    try {
      // Unsubscribe the user from notifications
      await User.findByIdAndUpdate(userId, { isSubscribedToNotifications: false });
      logger.info(`User ${userId} unsubscribed from notifications`);
    } catch (error) {
      logger.error('Failed to unsubscribe from notifications', error);
      throw new Error('Unsubscription failed');
    }
  }
};

module.exports = notificationService;
