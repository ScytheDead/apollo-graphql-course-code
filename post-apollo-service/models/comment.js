const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  contentComments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now },
    clap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subComments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      time: { type: Date, default: Date.now },
      clap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    }],
  }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Comment', commentSchema);
