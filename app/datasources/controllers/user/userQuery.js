const { User } = require('../../models');
const utils = require('../../utils/controllers');

async function getUsers(args, context, info) {
  if (!context.user) {
    return {
      result: 'fail',
      message: 'Not Authorised!',
    };
  }
  const { filter, limit = 10 } = args;
  const fieldsSelected = utils.getFieldsSelection(info, 'users');
  const filterCondition = {};
  filterCondition.username = filter.username && { $regex: `.*${filter.username}.*` };
  filterCondition.name = filter.name && { $regex: `.*${filter.name}.*` };
  filterCondition.email = filter.email && { $regex: `.*${filter.email}.*` };
  filterCondition.role = filter.role && { $regex: `.*${filter.role}.*` };
  filterCondition._id = filter.lastId && { $gt: filter.lastId };
  for (const key in filterCondition) {
    if (!filterCondition[key]) {
      delete filterCondition[key];
    }
  }

  try {
    const users = await User.find(filterCondition, { ...fieldsSelected }).sort({ _id: 1 }).limit(limit);
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
    if (!context.user) {
      return {
        result: 'fail',
        message: 'Not Authorised!',
      };
    }

    const { _id } = args;
    const fieldsSelected = utils.getFieldsSelection(info, 'user');
    const user = await User.findOne({ _id }, { ...fieldsSelected });

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
