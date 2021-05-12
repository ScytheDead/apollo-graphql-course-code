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
  clapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'claper',
  }],
}, { timestamps: true });

module.exports = mongoose.model('post', PostSchema);
