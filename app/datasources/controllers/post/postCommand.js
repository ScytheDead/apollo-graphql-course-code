const _ = require('lodash');
const utils = require('../../utils/controllers');

const { Post, Clap } = require('../../models');

async function clapPost(args, context, info) {
  const { user } = context;
  const { _id } = args;

  try {
    const post = await Post.findByIdAndUpdate(_id, {
      clapQuantity: { $inc: 1 },
    }, {
      fields: utils.getFieldsSelection(info, 'post'),
      new: true,
    }).lean();

    if (!post) {
      return {
        isSuccess: false,
        message: 'Post is not exists',
      };
    }

    await Clap.updateOne(
      { post: _id, user: user._id },
      { count: { $inc: 1 } },
      { upsert: true, setDefaultsOnInsert: true },
    );

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

async function createPost(args, context) {
  const { user } = context;
  try {
    args.input.owner = user._id;
    const post = await Post.create(args.input);

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
  clapPost,
  createPost,
};
