const { getFields } = require('../../utils/controllers');

const { Post, Clap } = require('../../models');

async function clapPost(args, context, info) {
  try {
    const { user } = context;
    const { _id } = args;

    const post = await Post.findOneAndUpdate({
      _id,
      owner: {
        $ne: user._id,
      },
    },
    {
      $inc: { clapQuantity: 1 },
    }, {
      fields: getFields(info, 'post'),
      new: true,
    }).lean();

    if (!post) {
      return {
        isSuccess: false,
      };
    }

    await Clap.updateOne(
      { post: _id, user: user._id },
      { $inc: { count: 1 } },
      { upsert: true, setDefaultsOnInsert: true },
    );

    return {
      isSuccess: true,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function createPost(args, context) {
  try {
    const { user } = context;
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

async function updatePost(args, info) {
  try {
    const { _id, input } = args;
    const fieldsSelected = getFields(info, 'post');
    const post = await Post.findByIdAndUpdate(
      { _id },
      input,
      { fields: fieldsSelected, new: true },
    );

    return {
      isSuccess: !!post,
      post,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function deletePost(args, context) {
  try {
    args.owner = context.user._id;
    const post = await Post.deleteOne(args);

    return {
      isSuccess: !!post.deletedCount,
    };
  } catch (error) {
    return {
      isSuccess: false,
    };
  }
}

module.exports = {
  clapPost,
  createPost,
  updatePost,
  deletePost,
};
