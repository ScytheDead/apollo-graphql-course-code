const { rule, shield, allow } = require('graphql-shield');

const isAuthenticated = rule()((parent, args, { user }) => user !== null);
const isAdmin = rule()((parent, args, { user }) => user && user.role === 'Admin');

const permissions = shield(
  {
    Query: {
      users: isAuthenticated,
      user: isAuthenticated,
    },

    Mutation: {
      createComment: isAuthenticated,
      deleteComment: isAuthenticated,
      updateComment: isAuthenticated,
      createUser: isAdmin,
      updateUser: isAuthenticated,
      deleteUser: isAuthenticated,
      register: allow,
      login: allow,
    },
  },
  {
    fallbackError: {
      isSuccess: false,
      message: 'Not Authorised!',
    },
  },
);

module.exports = { permissions };
