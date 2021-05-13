async function login(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.login(args, context, info);
  return result;
}

async function createUser(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.createUser(args, context, info);
  return result;
}

module.exports = {
  login,
  createUser,
};
