const userController = require('./user');
const postController = require('./post');
const clapController = require('./clap');

module.exports = {
  ...userController,
  ...postController,
  ...clapController,
};
