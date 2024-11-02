const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/users/profile
// Route to retrieve the user's profile information, requires authentication
router.get('/profile', authMiddleware, userController.getUserProfile);

// PUT /api/users/profile
// Route to update the user's profile information, requires authentication
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Additional routes can be added as needed
// Example: Updating user preferences
router.put('/preferences', authMiddleware, userController.updateUserPreferences);

// Example: Change user password
router.put('/change-password', authMiddleware, userController.changePassword);

// Export the user router to be used in app.js
module.exports = router;
