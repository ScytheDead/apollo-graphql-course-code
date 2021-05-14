const _ = require('lodash');
const { User } = require('../../models');
const { getFields } = require('../../utils/controllers');

async function getUsers(args, context, info) {
  try {
    const { filter, limit = 10 } = args;
    const fieldsSelected = getFields(info, 'users');
    const conditions = _.pick(filter, ['role']);
    if (filter.username) {
      conditions.username = { $regex: filter.username, $options: 'i' };
    }
    if (filter.name) {
      conditions.$or = [
        { firstName: { $regex: filter.name, $option: 'i' } },
        { lastName: { $regex: filter.name, $option: 'i' } },
      ];
    }
    if (filter.email) {
      conditions.email = { $regex: filter.email, $options: 'i' };
    }
    if (filter.lastId) {
      conditions._id = { $gt: filter.lastId };
    }
    console.log(conditions);
    const users = await User.find(conditions, fieldsSelected).sort({ _id: 1 }).limit(limit);
    const lastId = users[users.length - 1] && users[users.length - 1]._id;

    return {
      isSuccess: true,
      lastId,
      users,
    };
  } catch (error) {
    console.log();
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getUser(args, context, info) {
  try {
    const { _id } = args;
    const user = await User.findOne({ _id }, getFields(info, 'user')).lean();

    return {
      isSuccess: true,
      user,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  getUsers,
  getUser,
};
