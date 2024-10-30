// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true, // Adding index for quicker queries
  },
  message: {
    type: String,
    required: true,
    maxlength: 500, // Added constraint to avoid oversized messages
  },
  title: {
    type: String,
    default: 'New Alert',
    maxlength: 100,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Using timestamps for createdAt and updatedAt

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
