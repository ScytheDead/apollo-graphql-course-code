const { UserInputError } = require('apollo-server-express');
const axios = require('axios');
const { getSelectedFieldsString } = require('../../utils/graphql');
const { redisGet, redisSet } = require('../../utils/redis');
const Post = require('../../models/post');

const { EXPIRATION_TIME_REDIS_CACHE } = process.env;

module.exports = {
  Mutation: {
    addPost: async (parent, args, context, info) => {
      const { title, content, imageURL } = args;
      const selectedFieldsString = getSelectedFieldsString(info);
      const { redis, dataSources, user } = context;

      try {
        // const { data: { user } } = await dataSources.UsersAPI.getUser(userID, authorization);
        // if (user && user.__typename === 'UserUnauthorized') {
        //   return {
        //     __typename: 'PostResult',
        //     result: 'fail',
        //     message: user.error,
        //   };
        // }

        const post = new Post({ title, content, user: user.sub, imageURL });
        const postSaved = await post.save();

        // // Clear cache movie
        // redisRemoveAllKeysByPattern(redis, 'movie:*');

        return {
          __typename: 'PostResult',
          result: 'success',
          data: {
            __typename: 'Post',
            ...postSaved.toObject(),
          },
        };
      } catch (error) {
        console.log(error);
        return {
          result: 'fail',
          message: error.message,
        };
      }
    },
    updatePost: async (parent, args, context, info) => {
      const { _id, userID, ...dataUpdate } = args;
      const selectedFieldsString = getSelectedFieldsString(info);
      const { redis, dataSources } = context;

      try {
        const post = await Post.findById(_id);
        if (!post) {
          return {
            result: 'fail',
            message: 'Invalid post ID',
          };
        }

        if (post.user.toString() !== userID) {
          return {
            result: 'fail',
            message: 'Post update not of this user',
          };
        }

        const { data: { user } } = await dataSources.UsersAPI.getUser(userID);
        if (!user) {
          return {
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        for (const key in dataUpdate) {
          post[key] = dataUpdate[key];
        }

        await post.save();

        return {
          result: 'success',
          data: post,
        };
      } catch (error) {
        return {
          result: 'success',
          message: error.message,
        };
      }
    },
    deletePost: async (parent, args, context, info) => {
      const { _id, userID } = args;
      const selectedFieldsString = getSelectedFieldsString(info);
      const { redis, dataSources } = context;

      try {
        const post = await Post.findById(_id);
        if (!post) {
          return {
            result: 'fail',
            message: 'Invalid post ID',
          };
        }

        if (post.user.toString() !== userID) {
          return {
            result: 'fail',
            message: 'Post update not of this user',
          };
        }

        const { data: { user } } = await dataSources.UsersAPI.getUser(userID);
        if (!user) {
          return {
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        await post.remove();

        return {
          result: 'success',
          data: post,
        };
      } catch (error) {
        return {
          result: 'success',
          message: error.message,
        };
      }
    },
    clapPost: async (parent, args, context, info) => {
      const { postID, userID } = args;
      const selectedFieldsString = getSelectedFieldsString(info);
      const { redis, dataSources } = context;

      try {
        const post = await Post.findById(postID);
        if (!post) {
          return {
            result: 'fail',
            message: 'Invalid post ID',
          };
        }

        if (post.user.toString() === userID) {
          return {
            result: 'fail',
            message: 'Cannot clap myself',
          };
        }

        const { data: { user } } = await dataSources.UsersAPI.getUser(userID);
        if (!user) {
          return {
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        const indexUserID = post.clap.findIndex(clapUserID => clapUserID.toString() === userID);
        if (indexUserID !== -1) {
          post.clap.splice(indexUserID, 1);
        } else {
          post.clap.push(userID);
        }

        await post.save();

        return {
          result: 'success',
          data: post,
        };
      } catch (error) {
        return {
          result: 'success',
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
    __resolveReference: async ref => {
      const currentPost = await Post.findOne({ _id: ref._id });
      return currentPost;
    },
    user: post => ({ __typename: 'User', _id: post.user }),
  },
  User: {
    posts: user => Post.find({
      _id: {
        $in: user.posts,
      },
    }),
    subscribes: user => Post.find({
      _id: {
        $in: user.subscribes,
      },
    }),
  },
};
