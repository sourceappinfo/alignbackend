// controllers/notificationController.js
const notificationService = require('../notifications/notificationService');
const { responseFormatter } = require('../utils/responseFormatter');

const notificationController = {
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await notificationService.getNotifications(userId);
      res.json(responseFormatter.success(notifications));
    } catch (error) {
      res.status(500).json(responseFormatter.error('Failed to retrieve notifications'));
    }
  },

  async subscribe(req, res) {
    try {
      const userId = req.user.id;
      await notificationService.subscribe(userId);
      res.json(responseFormatter.success({ message: 'Subscribed to notifications' }));
    } catch (error) {
      res.status(500).json(responseFormatter.error('Failed to subscribe to notifications'));
    }
  },

  async unsubscribe(req, res) {
    try {
      const userId = req.user.id;
      await notificationService.unsubscribe(userId);
      res.json(responseFormatter.success({ message: 'Unsubscribed from notifications' }));
    } catch (error) {
      res.status(500).json(responseFormatter.error('Failed to unsubscribe from notifications'));
    }
  },

  async sendNotification(req, res) {
    try {
      const { userId, message } = req.body;
      await notificationService.sendNotification(userId, message);
      res.json(responseFormatter.success({ message: 'Notification sent successfully' }));
    } catch (error) {
      res.status(500).json(responseFormatter.error('Failed to send notification'));
    }
  }
};

module.exports = notificationController;
