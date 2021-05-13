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

async function createUser(args, context, info) {
  let { username, password, firstName, lastName, email, role } = args.input;

  username = username.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  role = role.trim();

  if (!username || !password.trim() || !firstName || !lastName || !email || !role) {
    return {
      isSuccess: false,
      message: 'Invalid input',
    };
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return {
        isSuccess: false,
        message: 'Username or email already exists',
      };
    }

    const hash = await argon2.hash(password);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      hash,
      role,
    });
    const savedUser = await newUser.save();

    return {
      isSuccess: true,
      user: savedUser,
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
