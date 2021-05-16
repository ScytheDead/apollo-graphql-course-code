async function post(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getPost({ _id: parent.post }, context, info);
  return result.post;
}

async function user(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUser({ _id: parent.user }, context, info);
  return result.user;
}

const Comment = {
  user,
  post,
};

module.exports = Comment;
