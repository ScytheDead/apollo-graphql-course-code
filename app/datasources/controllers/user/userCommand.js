const argon2 = require('argon2');
const randomstring = require('randomstring');
const { authenticateStore: redis } = require('../../utils/redis/stores');
const utils = require('../../utils/controllers');

const { User } = require('../../models');

async function login(args, context, info) {
  const { username, password } = args.input;
  const fieldsSelected = utils.getFieldsSelection(info, 'user');
  fieldsSelected.hash = 1;

  try {
    if (!username.trim() || !password.trim()) {
      return {
        isSuccess: false,
        message: 'Invalid input',
      };
    }

    const user = await User.findOne({ username }, { ...fieldsSelected }).lean();
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
      process.env.EXPIRATION_TIME_TYPE,
      process.env.EXPIRATION_TIME_REDIS_CACHE,
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
    const foundUser = await User.count({ $or: [{ username }, { email }] });
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

module.exports = {
  login,
  createUser,
};
