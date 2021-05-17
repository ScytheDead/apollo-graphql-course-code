const argon2 = require('argon2');
const randomstring = require('randomstring');
const { authenticateStore: redis } = require('../../utils/redis/stores');
const { getFields } = require('../../utils/controllers');
const { expirationTimeType, expirationTime } = require('../../../config/redis');

const { User } = require('../../models');

async function login(args, context, info) {
  try {
    const { username, password } = args.input;
    const fieldsSelected = getFields(info, 'user');
    fieldsSelected.hash = 1;

    const user = await User.findOne({ username }, fieldsSelected).lean();
    if (!user) {
      return {
        isSuccess: false,
        message: 'Username is not exists',
      };
    }

    const { _id, hash } = user;
    const verify = await argon2.verify(hash, password);
    if (!verify) {
      return {
        isSuccess: false,
        message: 'Username or password is incorrect',
      };
    }

    delete user.hash;

    const accessToken = randomstring.generate(100) + _id + randomstring.generate(100);
    redis.setAsync(
      accessToken,
      JSON.stringify(user),
      expirationTimeType,
      expirationTime,
    );

    return {
      isSuccess: true,
      user,
      accessToken,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function createUser(args) {
  const { username, password, email } = args.input;

  try {
    const foundUser = await User.countDocuments({ $or: [{ username }, { email }] });
    if (foundUser) {
      return {
        isSuccess: false,
        message: 'Username or email already exists',
      };
    }

    const hash = await argon2.hash(password);
    args.input.hash = hash;
    const createdUser = await User.create(args.input);

    return {
      isSuccess: true,
      user: createdUser,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function updateUser(args, context, info) {
  try {
    const { input } = args;
    const user = await User.findByIdAndUpdate(
      { _id: context.user._id },
      input,
      { fields: getFields(info, 'user'), new: true },
    );

    return {
      isSuccess: !!user,
      user,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function deleteUser(args, context) {
  try {
    const { _id } = context.user;
    const user = await User.deleteOne({ _id });
    if (!user.deletedCount) {
      return {
        isSuccess: false,
        message: 'User not found',
      };
    }

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
  login,
  createUser,
  updateUser,
  deleteUser,
};
