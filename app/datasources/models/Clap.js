const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const ClapSchema = mongoose.Schema({
  post: {
    type: ObjectId,
    ref: 'post',
  },
  user: {
    type: ObjectId,
    ref: 'user',
  },
  count: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('clap', ClapSchema);
