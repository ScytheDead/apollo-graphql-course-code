async function getUser(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUser(args, context, info);
  return result;
}

async function getUsers(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUsers(args, context, info);
  return result;
}

module.exports = {
  user: getUser,
  users: getUsers,
};
