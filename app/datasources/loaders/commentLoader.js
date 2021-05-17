const DataLoader = require('dataloader');
const { Comment } = require('../models');

const commentLoader = new DataLoader(async commentLoaders => {
  const [{ getFields }] = commentLoaders;
  const commentIds = commentLoaders.map(({ commentId }) => commentId);
  const comments = await Comment.find({ _id: { $in: commentIds } }, getFields).lean();
  return commentIds.map(commentId => comments.find(comment => comment._id.toString() === commentId.toString()));
});

module.exports = {
  commentLoader,
};
