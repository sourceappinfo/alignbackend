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

// GET /api/notifications/stream - Server-Sent Events (SSE) for real-time notifications
router.get('/stream', authMiddleware, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send a connection acknowledgment message
  res.write('data: Connected to notifications stream\n\n');

  // Event handler for real notifications
  const sendNotification = (message) => {
    res.write(`data: ${JSON.stringify({ message })}\n\n`);
  };

  // Mock notification for testing every 10 seconds (replace with actual event triggers)
  const intervalId = setInterval(() => {
    sendNotification("New notification available!");
  }, 10000);

  // Clean up the connection on close
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

module.exports = router;
