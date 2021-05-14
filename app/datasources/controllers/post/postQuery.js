const _ = require('lodash');
const { Post } = require('../../models');
const utils = require('../../utils/controllers');

async function getPosts(args, context, info) {
  const { filter, limit = 10 } = args;
  const fieldsSelected = utils.getFieldsSelection(info, 'posts');

  const conditions = _.pick(filter, ['isPublic', 'owner']);
  if (filter.title) {
    conditions.title = { $regex: filter.title, $option: 'i' };
  }

  if (filter.content) {
    conditions.content = { $regex: filter.title, $option: 'i' };
  }

  if (filter.description) {
    conditions.description = { $regex: filter.title, $option: 'i' };
  }

  if (filter.lastId) {
    conditions._id = { $gt: filter.lastId };
  }

  try {
    const posts = await Post.find(conditions, fieldsSelected).sort({ _id: 1 }).limit(limit).lean();
    const lastId = posts[posts.length - 1] && posts[posts.length - 1]._id;

    return {
      isSuccess: true,
      lastId,
      posts,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getPost(args, context, info) {
  try {
    const { _id } = args;
    const fieldsSelected = utils.getFieldsSelection(info, 'post');
    const post = await Post.findById(_id, fieldsSelected);

    return {
      isSuccess: true,
      post,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  getPosts,
  getPost,
};
