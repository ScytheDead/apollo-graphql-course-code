async function login(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.login(args, context, info);
}

async function createUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createUser(args, context, info);
}

async function register(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createUser(args, context, info);
}

async function updateUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.updateUser(args, context, info);
}
async function deleteUser(parent, args, context) {
  const { dataSources } = context;
  return dataSources.deleteUser(args, context);
}

async function createPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createPost(args, context, info);
}

async function clapPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.clapPost(args, context, info);
}

async function updatePost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.updatePost(args, context, info);
}

async function deletePost(parent, args, context) {
  const { dataSources } = context;
  return dataSources.deletePost(args, context);
}

module.exports = {
  login,
  createUser,
  createPost,
  clapPost,
  updateUser,
  deleteUser,
  updatePost,
  deletePost,
  register,
};
