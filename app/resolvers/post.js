const { getFields } = require('../datasources/utils/controllers');

function owner(parent, args, context, info) {
  const { dataSources: { loaders: { userLoader } } } = context;
  return userLoader.load({ userId: parent.owner, getFields: getFields(info) });
}

module.exports = {
  owner,
};
