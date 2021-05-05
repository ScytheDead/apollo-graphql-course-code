const { and, or, rule, shield, allow } = require('graphql-shield');

function getPermissions(user) {
  if (user && user.data) {
    return user.data.permissions;
  }
  return [];
}

const isAuthenticated = rule()((parent, args, { user }) => user !== null);

const canReadAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('read:any_account');
});

const canReadOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('read:own_account');
});

const canEditAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('edit:any_account');
});

const canEditOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('edit:own_account');
});

const canDeleteAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('delete:any_account');
});

const canDeleteOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes('delete:own_account');
});

const isReadingOwnAccount = rule()((parent, { _id }, { user }) => user && user.sub === _id);

const permissions = shield(
  {
    Query: {
      user: or(and(canReadOwnAccount, isReadingOwnAccount), canReadAnyAccount),
      users: canReadAnyAccount,
      // viewer: isAuthenticated,
    },

    Mutation: {
      login: allow,
      addUser: allow,
      updateUser: or(and(canEditOwnAccount, isReadingOwnAccount), canEditAnyAccount),
      addPostToUser: or(and(canEditOwnAccount, isReadingOwnAccount), canEditAnyAccount),
      removePostFromUser: or(and(canEditOwnAccount, isReadingOwnAccount), canEditAnyAccount),
      subscribePost: or(and(canEditOwnAccount, isReadingOwnAccount), canEditAnyAccount),
    },
  },
  {
    fallbackError: {
      __typename: 'UserUnauthorized',
      error: 'Not Authorised!',
    },
  },
);

module.exports = { permissions };
