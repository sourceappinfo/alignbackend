const mongoose = require('mongoose');
const notificationService = require('../../services/notificationService');
const Notification = require('../../models/Notification');

jest.mock('../../models/Notification');

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new notification', async () => {
    const notificationData = {
      title: 'New Alert',
      message: 'Test notification',
      userId: 'user123'
    };

    Notification.create.mockResolvedValue({
      ...notificationData,
      _id: 'notification123'
    });

    const result = await notificationService.sendNotification(
      notificationData.userId,
      notificationData.message
    );

    expect(result).toHaveProperty('title', 'New Alert');
    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: notificationData.userId })
    );
  });

  it('should handle failed notification creation', async () => {
    Notification.create.mockRejectedValue(new Error('DB Error'));

    await expect(
      notificationService.sendNotification('userId', 'message')
    ).rejects.toThrow('DB Error');
  });

  it('should retrieve notifications for a user', async () => {
    const userId = 'user123';
    const mockNotifications = [
      { _id: 'notif1', message: 'Test 1', userId },
      { _id: 'notif2', message: 'Test 2', userId }
    ];

    Notification.find.mockResolvedValue(mockNotifications);

    const result = await notificationService.getNotifications(userId);
    expect(result).toEqual(mockNotifications);
    expect(Notification.find).toHaveBeenCalledWith({ userId });
  });

  it('should mark notifications as read', async () => {
    const notificationId = 'notif123';
    Notification.findByIdAndUpdate.mockResolvedValue({
      _id: notificationId,
      read: true
    });

    await notificationService.markAsRead(notificationId);
    expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
      notificationId,
      { read: true }
    );
  });
});