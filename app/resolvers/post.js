async function owner(parent, args, context, info) {
  const result = await context.dataSources.User.getUser({ _id: parent.owner }, context, info);
  return result.user;
}

module.exports = {
  owner,
};
