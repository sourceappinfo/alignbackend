const Notification = require('../models/Notification');

class NotificationService {
  static async sendNotification(userId, message) {
    try {
      const notification = await Notification.create({
        userId,
        message,
        title: 'New Alert',
        createdAt: new Date(),
        read: false
      });
      
      return notification;
    } catch (error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  static async getNotifications(userId) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 });
      return notifications;
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  static async markAsRead(notificationId) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
      
      if (!notification) {
        throw new Error('Notification not found');
      }
      
      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      
      if (!notification) {
        throw new Error('Notification not found');
      }
      
      return notification;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }
}

module.exports = NotificationService;
