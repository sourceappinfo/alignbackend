const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot be longer than 500 characters']
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post ID is required'],
    index: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });

commentSchema.methods.like = async function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    await this.save();
  }
  return this;
};

commentSchema.methods.unlike = async function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  await this.save();
  return this;
};

commentSchema.methods.addReply = async function(userId, content) {
  this.replies.push({ userId, content });
  await this.save();
  return this;
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;