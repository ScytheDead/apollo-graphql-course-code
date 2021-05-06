const md5 = require('md5');
// const { UserInputError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
// const { getSelectedFieldsString } = require('../../utils/graphql');
// const { redisRemoveAllKeysByPattern, redisSet } = require('../../utils/redis');
// const { createKeyRedisUserSession } = require('../../utils/helpers');
const User = require('../../models/user');

// const { EXPIRATION_TIME_REDIS_CACHE } = process.env;

module.exports = {
  Mutation: {
    addUser: async (parent, args, context, info) => {
      const { username, password, email, role, permissions } = args;
      const passwordEncryption = md5(password);

      try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
          return {
            __typename: 'UserResult',
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

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'User',
            ...userSaved,
          },
        };
      } catch (error) {
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    updateUser: async (parent, args) => {
      const { _id, ...dataUpdate } = args;

      try {
        const user = await User.findById(_id);
        if (!user) {
          return {
            __typename: 'UserResult',
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        for (const key in dataUpdate) {
          user[key] = dataUpdate[key];
        }

        // Update to DB
        await user.save();

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'User',
            ...user.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    removePostFromUser: async (parent, args) => {
      const { _id, postID } = args;

      try {
        const user = await User.findById({ _id });
        if (!user) {
          return {
            __typename: 'UserResult',
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        user.posts.push(postID);
        await user.save();

        return {
          __typename: 'UserResult',
          result: 'fail',
          data: {
            __typename: 'User',
            ...user.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    addPostToUser: async (parent, args) => {
      const { _id, postID } = args;

      try {
        const user = await User.findById(_id);
        if (!user) {
          return {
            __typename: 'UserResult',
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        if (user.posts.includes(postID)) {
          return {
            __typename: 'UserResult',
            result: 'fail',
            message: 'This post already exists in current user',
          };
        }

        user.posts.push(postID);
        await user.save();

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'User',
            ...user.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
    subscribePost: async (parent, args) => {
      const { _id, postID } = args;

      try {
        const user = await User.findById(_id);
        if (!user) {
          return {
            __typename: 'UserResult',
            result: 'fail',
            message: 'Invalid user ID',
          };
        }

        user.subscribes.push(postID);
        await user.save();

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'User',
            ...user.toObject(),
          },
        };
      } catch (error) {
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
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
        return {
          __typename: 'LoginFail',
          result: 'fail',
          message: error.message,
        };
      }
    },
  },
  Query: {
    users: async () => {
      try {
        const users = await User.find().lean();

        return {
          __typename: 'UserResult',
          result: 'success',
          data: {
            __typename: 'ListUser',
            users,
          },
        };
      } catch (error) {
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
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
        return {
          __typename: 'UserResult',
          result: 'fail',
          message: error.message,
        };
      }
    },
  },
};
