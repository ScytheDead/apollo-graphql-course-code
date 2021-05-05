const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, unique: true, required: true, trim: true, minlength: [5, 'title too short'], maxlength: [255, 'title too long'] },
  ascii_title: { type: String },
  content: { type: String, required: true, minlength: [20, 'content too short'] },
  imageURL: { type: String, required: true },
  status: { type: String, default: 'SHOW' },
  clap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

postSchema.index({ title: 'text', ascii_title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
