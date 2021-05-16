const { getFields } = require('../../utils/controllers');

const { Comment } = require('../../models');

async function createComment(args, context) {
  try {
    const { user } = context;
    const { input } = args;
    input.user = user._id;
    const comment = await Comment.create(input);

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
    );

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
    const { user } = context;
    const { _id } = args;
    const comment = await Comment.deleteOne({ _id, user: user._id });
    if (comment.deletedCount) {
      await Comment.deleteMany({ parent: _id });
    }

    return comment.deletedCount;
  } catch (error) {
    return false;
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
