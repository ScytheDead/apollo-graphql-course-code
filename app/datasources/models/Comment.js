const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const CommentSchema = mongoose.Schema({
  post: {
    type: ObjectId,
    ref: 'post',
  },
  user: {
    type: ObjectId,
    ref: 'user',
  },
  content: {
    type: String,
    required: true,
  },
  parent: {
    type: ObjectId,
    ref: 'comment',
  },
}, { timestamps: true });

module.exports = mongoose.model('comment', CommentSchema);
