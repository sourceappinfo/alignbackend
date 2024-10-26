const Notification = require('../models/Notification');
const User = require('../models/User');

const subscribeUser = async (userId, notificationType) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.notifications.push(notificationType);
  await user.save();

  return user;
};

const sendNotification = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Placeholder for notification logic (e.g., email, SMS)
  console.log(`Sending notification to ${user.email}: ${message}`);
};

module.exports = { subscribeUser, sendNotification };
