const express = require('express');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the app
const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Apply rate limiting globally
app.use(rateLimiter);

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/users', require('./routes/user'));
app.use('/api/search', require('./routes/search'));
app.use('/api/notifications', require('./routes/notifications'));

// Define a port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
