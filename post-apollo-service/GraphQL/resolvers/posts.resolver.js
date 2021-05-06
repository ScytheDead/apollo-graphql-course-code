// const { UserInputError } = require('apollo-server-express');
// const axios = require('axios');
const { getSelectedFieldsString } = require('../../utils/graphql');
// const { redisGet, redisSet } = require('../../utils/redis');
const Post = require('../../models/post');

// const { EXPIRATION_TIME_REDIS_CACHE } = process.env;

module.exports = {
  Mutation: {
    addPost: async (parent, args, context) => {
      const { title, content, imageURL } = args;
      const { user } = context;

      try {
        const post = new Post({ title, content, user: user.sub, imageURL });
        const postSaved = await post.save();

        return {
          __typename: 'PostResult',
          result: 'success',
          data: {
            __typename: 'Post',
            ...postSaved.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'PostResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    updatePost: async (parent, args, context) => {
      const { _id, ...dataUpdate } = args;

      try {
        const post = await Post.findById(_id);
        if (!post) {
          return {
            __typename: 'PostResult',
            result: 'fail',
            message: 'Invalid post ID',
          };
        }

        for (const key in dataUpdate) {
          post[key] = dataUpdate[key];
        }

        await post.save();

        return {
          __typename: 'PostResult',
          result: 'success',
          data: {
            __typename: 'Post',
            ...post.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'PostResult',
          result: 'success',
          message: error.message,
        };
      }
    },
    deletePost: async (parent, args) => {
      const { _id } = args;

      try {
        const post = await Post.findById(_id);
        if (!post) {
          return {
            __typename: 'PostResult',
            result: 'fail',
            message: 'Invalid post ID',
          };
        }

        await post.remove();

        return {
          __typename: 'PostResult',
          result: 'success',
          data: {
            __typename: 'Post',
            ...post.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'PostResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    clapPost: async (parent, args, context) => {
      const { _id } = args;
      const { user } = context;

      try {
        const post = await Post.findById(_id);
        if (!post) {
          return {
            __typename: 'PostResult',
            result: 'fail',
            message: 'Invalid post ID',
          };
        }

        if (post.user.toString() === user.sub) {
          return {
            __typename: 'PostResult',
            result: 'fail',
            message: 'Cannot clap myself',
          };
        }

        const indexUserID = post.clap.findIndex(clapUserID => clapUserID.toString() === user.sub);
        if (indexUserID !== -1) {
          post.clap.splice(indexUserID, 1);
        } else {
          post.clap.push(user.sub);
        }

        await post.save();

        return {
          __typename: 'PostResult',
          result: 'success',
          data: {
            __typename: 'Post',
            ...post.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'PostResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
  },
  Query: {
    posts: async (parent, args, context, info) => {
      const { start, length, sortByProperty, isSortASC } = args;

      try {
        // Query to DB get all posts
        const posts = await Post.find()
          .limit(length)
          .skip(start)
          .sort({
            [sortByProperty]: isSortASC,
          })
          .lean();

        return {
          __typename: 'PostResult',
          result: 'success',
          data: {
            __typename: 'ListPost',
            posts,
          },
        };
      } catch (error) {
        return {
          __typename: 'PostResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    post: async (parent, args) => {
      const { id } = args;

      const post = await Post.findById(id).lean();
      if (!post) {
        return {
          __typename: 'PostResult',
          result: 'fail',
          message: 'Invalid post ID',
        };
      }

      return {
        __typename: 'PostResult',
        result: 'success',
        data: {
          __typename: 'Post',
          ...post,
        },
      };
    },
  },
  Post: {
    // __resolveReference: async ref => {
    //   const currentPost = await Post.findOne({ _id: ref._id });
    //   return currentPost;
    // },
    user: post => ({ __typename: 'User', _id: post.user }),
  },
};
