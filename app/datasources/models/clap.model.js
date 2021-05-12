const mongoose = require('mongoose');

const ClapSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  clapAt: { type: Date, default: Date.now },
  numClap: { type: Number, default: 0 },
});
module.exports = mongoose.model('clap', ClapSchema);
