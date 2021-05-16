async function getUser(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getUser(args, context, info);
}

async function getUsers(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getUsers(args, context, info);
}

async function getPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getPost(args, context, info);
}

async function getPosts(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getPosts(args, context, info);
}

async function getClap(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getClap(args, info);
}

async function getClapOfPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getClapOfPost(args, context, info);
}

async function getComment(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getComment(args, info);
}

async function getCommentOfPost(parent, args, context, info) {
  const { dataSources } = context;
  return dataSources.getCommentOfPost(args, context, info);
}

module.exports = {
  user: getUser,
  users: getUsers,
  post: getPost,
  posts: getPosts,
  getClap,
  getClapOfPost,
  getComment,
  getCommentOfPost,
};
