const mongoose = require('mongoose');

const { Schema } = mongoose;

const userClapSchema = new Schema({
  clapId: {
    type: Schema.Types.ObjectId,
    ref: 'Clap',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  count: {
    type: Number,
    require: true,
    default: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Claper', userClapSchema);
