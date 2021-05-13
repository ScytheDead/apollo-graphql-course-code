const { rule, shield, allow } = require('graphql-shield');

const isAuthenticated = rule()((parent, args, { user }) => user !== null);

const permissions = shield(
  {
    Query: {
      users: isAuthenticated,
      user: isAuthenticated,
    },

    Mutation: {
      createUser: allow,
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
