const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json(formatSuccessResponse(notifications));
  } catch (error) {
    res.status(500).json(formatErrorResponse('Failed to retrieve notifications'));
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = await notificationService.sendNotification(userId, message);
    res.status(201).json(formatSuccessResponse(notification));
  } catch (error) {
    res.status(500).json(formatErrorResponse('Failed to create notification'));
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.status(200).json(formatSuccessResponse(notification));
  } catch (error) {
    res.status(500).json(formatErrorResponse('Failed to mark notification as read'));
  }
});

module.exports = router;
