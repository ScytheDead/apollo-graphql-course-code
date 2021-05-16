function getUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getUser(args, context, info);
}

function getUsers(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getUsers(args, context, info);
}

function getPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getPost(args, context, info);
}

function getPosts(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getPosts(args, context, info);
}

function getClap(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getClap(args, info);
}

function getClapOfPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getClapOfPost(args, context, info);
}

function getComment(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getComment(args, context, info);
}

function getComments(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getComments(args, context, info);
}

module.exports = {
  user: getUser,
  users: getUsers,
  post: getPost,
  posts: getPosts,
  getClap,
  getClapOfPost,
  comment: getComment,
  comments: getComments,
};
