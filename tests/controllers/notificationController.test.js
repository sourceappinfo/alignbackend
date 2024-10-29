const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../controllers/notificationController');
const notificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService');
jest.mock('../../middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 'testUserId' };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should retrieve notifications for a user', async () => {
    const mockNotifications = [
      { id: '1', message: 'Test notification' }
    ];
    
    notificationService.getNotifications.mockResolvedValue(mockNotifications);
    
    const response = await request(app).get('/api/notifications');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toEqual(mockNotifications);
  });

  it('should create a new notification', async () => {
    const notificationData = {
      userId: 'testUser',
      message: 'Test message'
    };
    
    notificationService.sendNotification.mockResolvedValue({
      ...notificationData,
      id: '1'
    });
    
    const response = await request(app)
      .post('/api/notifications')
      .send(notificationData);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
  });

  it('should handle errors', async () => {
    notificationService.getNotifications.mockRejectedValue(new Error('Test error'));
    
    const response = await request(app).get('/api/notifications');
    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe('error');
  });
});