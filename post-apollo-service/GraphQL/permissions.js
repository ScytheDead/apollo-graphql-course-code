const { and, or, rule, shield, allow } = require('graphql-shield');

function getPermissions(user) {
  if (user && user.data) {
    return user.data.permissions;
  }
  return [];
}

const isAuthenticated = rule()((parent, args, { user }) => user !== null);

const canReadAnyPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('read:any_post');
});

const canReadOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('read:own_post');
});

const canAddPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('add:post');
});

const canEditAnyPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('edit:any_post');
});

const canEditOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('edit:own_post');
});

const canDeleteAnyPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('delete:any_post');
});

const canDeleteOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('delete:own_post');
});

const isReadingOwnPost = rule()((parent, { _id }, { user }) => user && user.sub === _id);

const permissions = shield(
  {
    Query: {
      posts: canReadAnyPost,
      post: canReadAnyPost,
      // viewer: isAuthenticated,
    },

    Mutation: {
      addPost: canAddPost,
      updatePost: or(and(canEditOwnPost, isReadingOwnPost), canEditAnyPost),
      deletePost: or(and(canDeleteOwnPost, isReadingOwnPost), canDeleteAnyPost),
      clapPost: isAuthenticated,
    },
  },
  {
    fallbackError: {
      __typename: 'PostUnauthorized',
      error: 'Not Authorised!',
    },
  },
);

module.exports = { permissions };
