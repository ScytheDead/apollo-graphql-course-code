const { getFields } = require('../datasources/utils/controllers');

function post(parent, args, context, info) {
  const { dataSources: { loaders: { postLoader } } } = context;
  return postLoader.load({ postId: parent.post, getFields: getFields(info) });
}

function user(parent, args, context, info) {
  const { dataSources: { loaders: { userLoader } } } = context;
  return userLoader.load({ userId: parent.user, getFields: getFields(info) });
}

function parent(parent, args, context, info) {
  const { dataSources: { loaders: { commentLoader } } } = context;
  if (!parent.parent) {
    return null;
  }

  return commentLoader.load({ commentId: parent.parent, getFields: getFields(info) });
}

module.exports = {
  post,
  user,
  parent,
};
