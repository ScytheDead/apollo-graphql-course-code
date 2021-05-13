async function login(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.login(args, context, info);
}

async function createUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createUser(args, context, info);
}

async function createPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createPost(args, context, info);
}

async function clapPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.clapPost(args, context, info);
}

module.exports = {
  login,
  createUser,
  createPost,
  clapPost,
};
