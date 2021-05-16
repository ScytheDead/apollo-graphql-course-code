const { getFields } = require('../../utils/controllers');
const { Comment } = require('../../models');

async function createComment(args, context) {
  try {
    const { user } = context;
    args.input.user = user._id;
    const comment = await Comment.create(args.input);

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

async function updateComment(args, context, info) {
  try {
    const { _id, input } = args;
    const { user } = context;
    const fieldsSelected = getFields(info, 'comment');

    const comment = await Comment.findOneAndUpdate(
      { _id, user },
      input,
      { fields: fieldsSelected, new: true },
    ).lean();
    if (!comment) {
      return {
        isSuccess: false,
        message: 'Comment not found'
      };
    }

    return {
      isSuccess: !!comment,
      comment,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function deleteComment(args, context) {
  try {
    args.user = context.user._id;
    const comment = await Comment.deleteOne(args);

    return {
      isSuccess: !!comment.deletedCount,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
