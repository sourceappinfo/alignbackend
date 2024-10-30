const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validationMiddleware } = require('../middleware/validationMiddleware');

// Register route with validation middleware
router.post('/register', validationMiddleware, authController.register);

// Login route with validation middleware
router.post('/login', validationMiddleware, authController.login);

// Export the router
module.exports = router;
