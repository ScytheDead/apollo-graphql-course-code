const DataLoader = require('dataloader');
const { Post } = require('../models');

const postLoader = new DataLoader(async postLoaders => {
  const [{ getFields }] = postLoaders;
  const postIds = postLoaders.map(({ postId }) => postId);
  const posts = await Post.find({ _id: { $in: postIds } }, getFields).lean();
  return postIds.map(postId => posts.find(post => post._id.toString() === postId.toString()));
});

module.exports = {
  postLoader,
};
