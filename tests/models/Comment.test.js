const mongoose = require('mongoose');
const Comment = require('../../models/Comment');

describe('Comment Model', () => {
  it('should create a new comment', async () => {
    const comment = new Comment({
      text: 'Sample comment text',
      company: new mongoose.Types.ObjectId(), // Assuming `company` is an ObjectId reference
      user: new mongoose.Types.ObjectId(),    // Assuming `user` is also an ObjectId reference
    });
    await comment.validate(); // This should pass without validation errors
  });
});
