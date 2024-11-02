// routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure token protection for specific routes

// Register route with validation middleware
router.post('/register', validationMiddleware, authController.register);

// Login route with validation middleware
router.post('/login', validationMiddleware, authController.login);

// Token verification route - checks if the token is valid
router.post('/verify-token', authController.verifyToken);

// Change password route - requires authentication
router.post('/change-password', authMiddleware, authController.changePassword);

// Request password reset route - does not require authentication
router.post('/request-password-reset', authController.requestPasswordReset);

// Reset password route - uses reset token from the email link
router.post('/reset-password', authController.resetPassword);

// Logout route - optional but can be used for frontend session handling
router.post('/logout', authMiddleware, authController.logout);

// Export the router
module.exports = router;
