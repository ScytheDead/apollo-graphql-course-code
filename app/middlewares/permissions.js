const { rule, shield } = require('graphql-shield');

const isAuthenticated = rule()((parent, args, { user }) => user !== null);

const permissions = shield(
  {
    Query: {
      users: isAuthenticated,
      user: isAuthenticated,
    },

    Mutation: {

    },
  },
  {
    fallbackError: {
      result: false,
      message: 'Not Authorised!',
    },
  },
);

module.exports = { permissions };
