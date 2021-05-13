const { authenticateStore: redis } = require('../../utils/redis/stores');
const utils = require('../../utils/controllers');

const { Post, Clap } = require('../../models');

async function clapPost(args, context, info) {
  const { user } = context;
  const { _id } = args;

  try {
    const post = await Post.findById(_id)
      .populate('owner');

    if (!post) {
      return {
        isSuccess: false,
        message: 'Post is not exists',
      };
    }

    post.numClap += 1;
    await post.save();

    let clap = await Clap.findOne({ post: _id, user: user._id });
    if (clap) {
      clap.count += 1;
    } else {
      clap = new Clap({
        post: _id, user: user._id,
      });
    }
    await clap.save();

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

async function createPost(args, context, info) {
  let { title, description, content } = args.input;
  const { user } = context;

  title = title.trim();
  description = description.trim();
  content = content.trim();

  if (!title || !description || !content) {
    return {
      isSuccess: false,
      message: 'Invalid input',
    };
  }

  try {
    const post = await Post.findOne({ title })
      .populate('owner');
    if (post) {
      return {
        isSuccess: false,
        message: 'Title already exists',
      };
    }

    args.input.owner = user._id;
    const newPost = new Post(args.input);
    const savedPost = await newPost.save();
    await Post.populate(savedPost, 'owner');

    return {
      isSuccess: true,
      post: savedPost,
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
