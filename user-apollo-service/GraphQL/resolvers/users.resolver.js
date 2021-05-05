const md5 = require('md5');
const { UserInputError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { getSelectedFieldsString } = require('../../utils/graphql');
const { redisRemoveAllKeysByPattern, redisSet } = require('../../utils/redis');
const { createKeyRedisUserSession } = require('../../utils/helpers');
const User = require('../../models/user');

const { EXPIRATION_TIME_REDIS_CACHE } = process.env;

module.exports = {
  Mutation: {
    addUser: async (parent, args, context, info) => {
      const { username, password, email, role, permissions } = args;
      const passwordEncryption = md5(password);

      const selectedFieldsString = getSelectedFieldsString(info);

      try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
          return {
            result: 'fail',
            message: 'Username or email already exists',
          };
        }

        const newUser = new User({
          username,
          password: passwordEncryption,
          email,
          role,
          permissions,
        });
        const userSaved = await newUser.save();

        // Clear cache movie
        // redisRemoveAllKeysByPattern(redis, 'user:*');

        return {
          result: 'success',
          data: userSaved,
        };
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    updateUser: async (parent, args, context, info) => {
      const selectedFieldsString = getSelectedFieldsString(info);
      const { redis } = context;
      const { id, ...dataUpdate } = args;

      try {
        // Update to DB
        await User.findOneAndUpdate({ _id: id }, {
          ...dataUpdate,
        }, {
          new: true,
          useFindAndModify: false,
        });

        // Clear cache movie
        const userSessionRedisKey = createKeyRedisUserSession(id, selectedFieldsString);
        redisRemoveAllKeysByPattern(redis, userSessionRedisKey);

        return User.findById(id).select(selectedFieldsString);
      } catch (error) {
        console.log(error);
      }
    },
    removePostFromUser: async (parent, args, context, info) => {
      const selectedFieldsString = getSelectedFieldsString(info);
      const { _id, postID } = args;

      try {
        const user = await User.findById({ _id });
        if (!user) {
          return {
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        user.posts.push(postID);
        await user.save();

        return {
          result: 'fail',
          data: User,
        };
      } catch (error) {
        return {
          result: 'fail',
          message: error.message,
        };
      }
    },
    addPostToUser: async (parent, args, context, info) => {
      const selectedFieldsString = getSelectedFieldsString(info);
      const { _id, postID } = args;

      try {
        const user = await User.findById({ _id });
        if (!user) {
          throw new UserInputError('Invalid user ID');
        }

        user.posts.push(postID);
        await user.save();

        return User.findById(_id).select(selectedFieldsString);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    subscribePost: async (parent, args, context, info) => {
      const selectedFieldsString = getSelectedFieldsString(info);
      const { redis } = context;
      const { id } = args;

      try {
        const user = await User.findOne({ id }).select(selectedFieldsString);
        if (!user) {
          throw new UserInputError('Invalid user ID');
        }

        user.subscribes.push();
        // // Update to DB
        // const user = await User.findOneAndUpdate({ _id: id }, {
        //   ...dataUpdate,
        // }, {
        //   new: true,
        //   useFindAndModify: false,
        // });

        // Clear cache movie
        const userSessionRedisKey = createKeyRedisUserSession(id, selectedFieldsString);
        redisRemoveAllKeysByPattern(redis, userSessionRedisKey);

        return User.findById(id).select(selectedFieldsString);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    login: async (parent, args) => {
      const { username, password } = args;
      const passwordEncryption = md5(password);

      try {
        const user = await User.findOne({
          username,
          password: passwordEncryption,
        });
        // .select(selectedFieldsString);

        if (!user) {
          return {
            __typename: 'LoginFail',
            result: 'fail',
            message: 'Username or password is incorrect',
          };
        }

        const { id, role, permissions } = user;

        return {
          __typename: 'LoginSuccess',
          result: 'success',
          token: jwt.sign(
            { data: { role, permissions } },
            process.env.JWT_SECRET,
            { algorithm: process.env.JWT_ALGORITHM_ENCRYPTION, subject: id, expiresIn: process.env.JWT_EXPIRE_TIME },
          ),
        };
      } catch (error) {
        console.log(error);
        return {
          __typename: 'LoginFail',
          result: 'fail',
          message: error.message,
        };
      }
    },
  },
  User: {
    __resolveReference: async ref => {
      const currentUser = await User.findOne({ _id: ref._id });
      return currentUser;
    },
  },
  Query: {
    users: async () => {
      try {
        const users = await User.find().lean();

        // const { redis } = context;
        // const userSessionRedisKey = createKeyRedisUserSession(user.id, selectedFieldsString);
        // redisSet(redis, userSessionRedisKey, user, EXPIRATION_TIME_REDIS_CACHE);

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'ListUser',
            users,
          },
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    user: async (parent, args) => {
      try {
        const user = await User.findById(args._id);

        if (!user) {
          return {
            __typename: 'UserResult',
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'User',
            ...user.toObject(),
          },
        };
      } catch (error) {
        console.log(error);
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
  },
};
