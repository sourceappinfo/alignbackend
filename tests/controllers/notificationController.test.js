const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app'); // Make sure you have an app.js file that exports the Express app
const NotificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService');

describe('Notification Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should retrieve notifications successfully', async () => {
      const mockNotifications = [
        { id: '1', message: 'Test 1' },
        { id: '2', message: 'Test 2' }
      ];

      NotificationService.getNotifications.mockResolvedValue(mockNotifications);

      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', 'Bearer test-token');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockNotifications);
    });

    it('should handle errors when retrieving notifications', async () => {
      NotificationService.getNotifications.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', 'Bearer test-token');

      expect(response.statusCode).toBe(500);
      expect(response.body.status).toBe('error');
    });
  });
});