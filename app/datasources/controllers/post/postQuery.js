const _ = require('lodash');
const { Post, Clap } = require('../../models');
const utils = require('../../utils/controllers');

async function getPosts(args, context, info) {
  const { filter, limit = 10 } = args;
  const fieldsSelected = utils.getFieldsSelection(info, 'posts');

  const filterCondition = {};
  if (_.isObject(filter)) {
    for (const key in filter) {
      filterCondition[key] = { $regex: `.*${filter[key]}.*` };
    }
  }

  try {
    const posts = await Post.find(filterCondition, { ...fieldsSelected }).sort({ _id: 1 }).limit(limit).populate('owner');
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
    const post = await Post.findById(_id, { ...fieldsSelected }).populate('owner');
    if (!post) {
      return {
        isSuccess: false,
        message: 'Invalid post ID',
      };
    }

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
