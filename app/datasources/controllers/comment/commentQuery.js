const models = require('../../models');
const { getFields } = require('../../utils/controllers');

async function getCommentOfPost(args, context, info) {
  try {
    const { filter, limit = 10 } = args;
    if (filter.lastId) {
      filter._id = { $gt: filter.lastId };
      delete filter.lastId;
    }
    const comments = await models.Comment.find(filter, getFields(info, 'comments')).limit(limit).lean();
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

async function getComment(args, info) {
  try {
    const { _id } = args;
    const comment = await models.Comment.findById(_id, getFields(info, 'comment')).lean();

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
  getCommentOfPost,
  getComment,
};
