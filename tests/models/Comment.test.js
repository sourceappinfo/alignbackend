const Comment = require('../../models/Comment');

describe('Comment Model', () => {
  it('should create a new comment', async () => {
    const comment = new Comment({
      userId: 'user123',
      companyId: 'company123',
      content: 'Great company!',
    });
    await comment.save();

    const foundComment = await Comment.findOne({ content: 'Great company!' });
    expect(foundComment).toBeTruthy();
  });
});
