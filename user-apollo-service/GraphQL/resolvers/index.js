// const postResolvers = require('./posts.resolver');
const userResolvers = require('./users.resolver');

module.exports = {
  // ...postResolvers,
  ...userResolvers,
};
