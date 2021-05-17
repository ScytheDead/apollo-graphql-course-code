const { getFields } = require('../../utils/controllers');
const { Post, Clap, Comment } = require('../../models');

async function clapPost(args, context) {
  try {
    const { _id } = args;
    const post = await Post.findById(_id).lean();
    if (!post) {
      return {
        isSuccess: false,
        message: 'Post not found',
      };
    }
    if (post.owner.toString() === context.user._id) {
      return {
        isSuccess: false,
        message: 'You cannot clap myself',
      };
    }
    await Post.updateOne({ _id }, { $inc: { clapQuantity: 1 } });
    await Clap.updateOne(
      { post: _id, user: context.user._id },
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
    args.input.owner = context.user._id;
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

async function updatePost(args, context, info) {
  try {
    const { _id, input } = args;
    const { _id: owner } = context.user;

    const post = await Post.findOneAndUpdate(
      { _id, owner },
      input,
      { fields: getFields(info, 'post'), new: true },
    ).lean();
    if (!post) {
      return {
        isSuccess: false,
        message: 'Post not found',
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

async function deletePost(args, context) {
  try {
    args.owner = context.user._id;
    const post = await Post.deleteOne(args);
    if (!post.deletedCount) {
      return {
        isSuccess: false,
        message: 'Post not found',
      };
    }

    await Promise.all([
      Comment.deleteMany({ post: args._id }),
      Clap.deleteMany({ post: args._id }),
    ]);

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

module.exports = {
  clapPost,
  createPost,
  updatePost,
  deletePost,
};
