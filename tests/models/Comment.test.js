const mongoose = require('mongoose');
const Comment = require('../../models/Comment');

describe('Comment Model', () => {
  beforeEach(async () => {
    await Comment.deleteMany({});
  });

  describe('Creation and Validation', () => {
    it('should create a new comment with valid data', async () => {
      const validComment = {
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment content'
      };

      const comment = new Comment(validComment);
      const savedComment = await comment.save();

      expect(savedComment._id).toBeDefined();
      expect(savedComment.content).toBe(validComment.content);
      expect(savedComment.userId.toString()).toBe(validComment.userId.toString());
      expect(savedComment.postId.toString()).toBe(validComment.postId.toString());
      expect(savedComment.likes).toHaveLength(0);
      expect(savedComment.replies).toHaveLength(0);
    });

    it('should fail to create comment without required fields', async () => {
      const invalidComment = new Comment({});

      let error;
      try {
        await invalidComment.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.postId).toBeDefined();
      expect(error.errors.content).toBeDefined();
    });

    it('should enforce content maxlength', async () => {
      const commentWithLongContent = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'a'.repeat(501) // Content longer than maxlength of 500
      });

      let error;
      try {
        await commentWithLongContent.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.content).toBeDefined();
    });
  });

  describe('Likes Functionality', () => {
    it('should successfully add a like to a comment', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      await comment.save();
      const likerId = new mongoose.Types.ObjectId();
      await comment.like(likerId);

      expect(comment.likes).toHaveLength(1);
      expect(comment.likes[0].toString()).toBe(likerId.toString());
    });

    it('should not add duplicate likes', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      await comment.save();
      const likerId = new mongoose.Types.ObjectId();
      
      await comment.like(likerId);
      await comment.like(likerId); // Try to add same like again

      expect(comment.likes).toHaveLength(1);
      expect(comment.likes[0].toString()).toBe(likerId.toString());
    });

    it('should successfully remove a like from a comment', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      await comment.save();
      const likerId = new mongoose.Types.ObjectId();
      
      await comment.like(likerId);
      await comment.unlike(likerId);

      expect(comment.likes).toHaveLength(0);
    });
  });

  describe('Replies Functionality', () => {
    it('should successfully add a reply to a comment', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      await comment.save();
      const replyUserId = new mongoose.Types.ObjectId();
      const replyContent = 'Test reply';
      
      await comment.addReply(replyUserId, replyContent);

      expect(comment.replies).toHaveLength(1);
      expect(comment.replies[0].userId.toString()).toBe(replyUserId.toString());
      expect(comment.replies[0].content).toBe(replyContent);
      expect(comment.replies[0].createdAt).toBeDefined();
    });

    it('should enforce reply content maxlength', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      await comment.save();
      const replyUserId = new mongoose.Types.ObjectId();
      const longReplyContent = 'a'.repeat(501);

      let error;
      try {
        await comment.addReply(replyUserId, longReplyContent);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toContain('maxlength');
    });
  });

  describe('Timestamps', () => {
    it('should create timestamps on save', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      const savedComment = await comment.save();

      expect(savedComment.createdAt).toBeDefined();
      expect(savedComment.updatedAt).toBeDefined();
      expect(savedComment.createdAt).toBeInstanceOf(Date);
      expect(savedComment.updatedAt).toBeInstanceOf(Date);
    });

    it('should update timestamp on modification', async () => {
      const comment = new Comment({
        userId: new mongoose.Types.ObjectId(),
        postId: new mongoose.Types.ObjectId(),
        content: 'Test comment'
      });

      await comment.save();
      const originalUpdatedAt = comment.updatedAt;

      // Wait a little bit to ensure timestamp will be different
      await new Promise(resolve => setTimeout(resolve, 100));

      comment.content = 'Updated content';
      await comment.save();

      expect(comment.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});