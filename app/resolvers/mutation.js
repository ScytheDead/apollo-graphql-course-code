function login(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.login(args, context, info);
}

function createUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createUser(args, context, info);
}

function register(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createUser(args, context, info);
}

function updateUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.updateUser(args, context, info);
}
function deleteUser(parent, args, context) {
  const { dataSources } = context;
  return dataSources.deleteUser(args, context);
}

function createPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createPost(args, context, info);
}

function clapPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.clapPost(args, context, info);
}

function updatePost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.updatePost(args, context, info);
}

function deletePost(parent, args, context) {
  const { dataSources } = context;
  return dataSources.deletePost(args, context);
}

function createComment(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.createComment(args, context, info);
}

function updateComment(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.updateComment(args, context, info);
}

function deleteComment(parent, args, context) {
  const { dataSources } = context;
  return dataSources.deleteComment(args, context);
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
  createComment,
  updateComment,
  deleteComment,
};
