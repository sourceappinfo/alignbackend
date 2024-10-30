const mongoose = require('mongoose');
const NotificationService = require('../../services/notificationService');
const Notification = require('../../models/Notification');
const User = require('../../models/User');
const cacheService = require('../../services/cacheService');

jest.mock('../../models/Notification');
jest.mock('../../models/User');
jest.mock('../../services/cacheService');

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockNotification = {
      message: 'Test notification',
      title: 'Test Title',
      type: 'info'
    };

    it('should create notification successfully', async () => {
      const mockCreatedNotification = {
        _id: new mongoose.Types.ObjectId(),
        userId: mockUserId,
        ...mockNotification,
        read: false
      };

      User.findById.mockResolvedValue({ _id: mockUserId });
      Notification.create.mockResolvedValue(mockCreatedNotification);

      const result = await NotificationService.sendNotification(
        mockUserId,
        mockNotification.message,
        mockNotification.title,
        mockNotification.type
      );

      expect(result).toEqual(mockCreatedNotification);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw error if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        NotificationService.sendNotification(mockUserId, mockNotification.message)
      ).rejects.toThrow('User not found');
    });
  });

  describe('getNotifications', () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockNotifications = [
      { _id: new mongoose.Types.ObjectId(), message: 'Notification 1' },
      { _id: new mongoose.Types.ObjectId(), message: 'Notification 2' }
    ];

    it('should return cached notifications if available', async () => {
      const mockCachedResult = {
        notifications: mockNotifications,
        pagination: { current: 1, total: 1 }
      };

      cacheService.get.mockResolvedValue(mockCachedResult);

      const result = await NotificationService.getNotifications(mockUserId);

      expect(result).toEqual(mockCachedResult);
      expect(Notification.find).not.toHaveBeenCalled();
    });

    it('should fetch and cache notifications if not cached', async () => {
      const mockFindQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockNotifications)
      };

      cacheService.get.mockResolvedValue(null);
      Notification.find.mockReturnValue(mockFindQuery);
      Notification.countDocuments.mockResolvedValue(mockNotifications.length);

      const result = await NotificationService.getNotifications(mockUserId);

      expect(result.notifications).toEqual(mockNotifications);
      expect(cacheService.set).toHaveBeenCalled();
    });
  });
});