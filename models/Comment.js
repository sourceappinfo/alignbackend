// tests/models/Comment.test.js
const mongoose = require('mongoose');
const Comment = require('../../models/Comment');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Comment Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Comment.deleteMany({});
  });

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
  });

  it('should create timestamps on save', async () => {
    const comment = new Comment({
      userId: new mongoose.Types.ObjectId(),
      postId: new mongoose.Types.ObjectId(),
      content: 'Test comment'
    });

    const savedComment = await comment.save();

    expect(savedComment.createdAt).toBeDefined();
    expect(savedComment.updatedAt).toBeDefined();
  });
});