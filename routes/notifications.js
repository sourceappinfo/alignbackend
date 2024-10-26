// routes/notifications.js
const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/notifications - Retrieve all notifications for the user
router.get('/', authMiddleware, notificationController.getNotifications);

// POST /api/notifications/subscribe - Subscribe to notifications
router.post('/subscribe', authMiddleware, notificationController.subscribe);

// POST /api/notifications/unsubscribe - Unsubscribe from notifications
router.post('/unsubscribe', authMiddleware, notificationController.unsubscribe);

// POST /api/notifications/send - Send a notification (admin or internal use)
router.post('/send', authMiddleware, notificationController.sendNotification);

module.exports = router;
