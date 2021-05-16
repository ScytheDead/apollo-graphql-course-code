const DataLoader = require('dataloader');
const { User } = require('../models');

const userLoader = new DataLoader(async (userloaders) => {
  const [{ getFields }] = userloaders;
  const userIds = userloaders.map(userLoader => userLoader.userId);
  const users = await User.find({ _id: { $in: userIds } }, getFields).lean();
  return userIds.map(userId => users.find(user => user._id.toString() === userId.toString()));
});

module.exports = {
  userLoader,
};
