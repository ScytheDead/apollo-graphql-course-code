const userController = require('./user');
const postController = require('./post');
const clapController = require('./clap');
const commentController = require('./comment');

module.exports = {
  ...userController,
  ...postController,
  ...clapController,
  ...commentController,
};
