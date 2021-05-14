const _ = require('lodash');
const { User } = require('../../models');
const utils = require('../../utils/controllers');

async function getUsers(args, context, info) {
  const { filter, limit = 10 } = args;
  const fieldsSelected = utils.getFieldsSelection(info, 'users');

  const conditions = _.pick(filter, ['role']);
  if (filter.username) {
    conditions.username = { $regex: filter.username, $option: 'i' };
  }

  if (filter.name) {
    conditions.$or = [
      { firstName: { $regex: filter.name, $option: 'i' } },
      { lastName: { $regex: filter.name, $option: 'i' } },
    ];
  }

  if (filter.email) {
    conditions.email = { $regex: filter.email, $option: 'i' };
  }

  if (filter.lastId) {
    conditions._id = { $gt: filter.lastId };
  }

  try {
    const users = await User.find(conditions, fieldsSelected).sort({ _id: 1 }).limit(limit);
    const lastId = users[users.length - 1] && users[users.length - 1]._id;

    return {
      isSuccess: true,
      lastId,
      users,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getUser(args, context, info) {
  try {
    const { _id } = args;
    const user = await User.findOne({ _id }, utils.getFieldsSelection(info, 'user'));

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
