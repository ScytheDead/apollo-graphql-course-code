const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  content: { type: String, default: '' },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  isPublic: { type: Boolean, default: true },

  numClap: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('post', PostSchema);
