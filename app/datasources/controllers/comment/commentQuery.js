const _ = require('lodash');
const { Comment } = require('../../models');
const { getFields } = require('../../utils/controllers');

async function getComments(args, context, info) {
  try {
    const { filter, limit = 10 } = args;
    const conditions = _.pick(filter, ['post']);

    if (filter.content) {
      conditions.content = { $regex: filter.content, $options: 'i' };
    }
    if (filter.parent) {
      conditions.parent = filter.parent;
    }
    if (filter.lastId) {
      conditions._id = { $gt: filter.lastId };
    }

    const comments = await Comment.find(conditions, getFields(info, 'comments')).limit(limit).lean();
    const lastId = comments[comments.length - 1] && comments[comments.length - 1]._id;

    return {
      isSuccess: true,
      lastId,
      comments,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getComment(args, context, info) {
  try {
    const { _id } = args;
    const comment = await Comment.findById(_id, getFields(info, 'comment')).lean();

    return {
      isSuccess: true,
      comment,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  getComments,
  getComment,
};
