const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  content: { type: String, default: '' },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  isPublic: { type: Boolean, default: false },
  numClap: { type: Number, default: 0 },
  claps: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    count: {
      type: Number,
      require: true,
      default: 1,
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model('post', PostSchema);
