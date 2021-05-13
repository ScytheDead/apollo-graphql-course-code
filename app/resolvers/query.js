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

module.exports = {
  user: getUser,
  users: getUsers,
  post: getPost,
  posts: getPosts,
};
