const postLoader = require('./postLoader');
const clapLoader = require('./clapLoader');
const userLoader = require('./userLoader');
const commentLoader = require('./commentLoader');

module.exports = {
  ...postLoader,
  ...clapLoader,
  ...userLoader,
  ...commentLoader,
};
