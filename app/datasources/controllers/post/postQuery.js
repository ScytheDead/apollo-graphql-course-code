const _ = require('lodash');
const { Post } = require('../../models');
const { getFields } = require('../../utils/controllers');

async function getPosts(args, context, info) {
  try {
    const { filter, limit = 10 } = args;
    const conditions = _.pick(filter, ['isPublic', 'owner']);
    if (filter.title) {
      conditions.title = { $regex: filter.title, $options: 'i' };
    }
    if (filter.content) {
      conditions.content = { $regex: filter.title, $options: 'i' };
    }
    if (filter.description) {
      conditions.description = { $regex: filter.title, $options: 'i' };
    }
    if (filter.lastId) {
      conditions._id = { $gt: filter.lastId };
    }
    const posts = await Post.find(conditions, getFields(info, 'posts')).limit(limit).lean();
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
    const post = await Post.findById(_id, getFields(info, 'post')).lean();

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
