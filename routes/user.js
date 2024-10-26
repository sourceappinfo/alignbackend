const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/users/profile
router.get('/profile', authMiddleware, userController.getUserProfile);

// PUT /api/users/profile
router.put('/profile', authMiddleware, userController.updateUserProfile);

module.exports = router;
