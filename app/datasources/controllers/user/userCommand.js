const argon2 = require('argon2');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

async function login(args, context, info) {
  const { username, password } = args.input;

  if (!username.trim() || !password.trim()) {
    return {
      isSuccess: false,
      message: 'Invalid input',
    };
  }

  const user = await User.findOne({ username });
  if (!user) {
    return {
      isSuccess: false,
      message: 'Username is not exists',
    };
  }

  const { _id, hash, email, firstName, lastName, role, birthday, isActive } = user;
  const verify = await argon2.verify(hash, password);
  if (!verify) {
    return {
      isSuccess: false,
      message: 'Username or password is incorrect',
    };
  }

  return {
    isSuccess: true,
    user,
    accessToken: jwt.sign(
      { data: JSON.stringify({ username, email, firstName, lastName, role, birthday, isActive }) },
      process.env.JWT_SECRET,
      { algorithm: process.env.JWT_ALGORITHM_ENCRYPTION,
        subject: _id.toString(),
        expiresIn: process.env.JWT_EXPIRE_TIME },
    ),
  };
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

    // const salt = randomstring.generate(20);
    // const passwordSalt = password + salt;
    const hash = await argon2.hash(password);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      hash,
      role,
    });
    const userSaved = await newUser.save();

    return {
      isSuccess: true,
      user: userSaved,
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
