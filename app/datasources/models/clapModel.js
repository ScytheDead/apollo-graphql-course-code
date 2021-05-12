const mongoose = require('mongoose');

const { Schema } = mongoose;

const clapSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  clapers: [{
    type: Schema.Types.ObjectId,
    ref: 'Claper',
  }],
  numberClaps: {
    type: Number,
    require: true,
    default: 1,
  },
}, {
  timestamps: true,
});
clapSchema.index({ numberClaps: 1, createdAt: 1 });

module.exports = mongoose.model('Clap', clapSchema);
