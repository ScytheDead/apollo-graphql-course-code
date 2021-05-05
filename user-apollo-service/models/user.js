const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
  phone: { type: String, /* unique: true, */ match: /(07|08|09|01[2|6|8|9])+([0-9]{8})\b/ },
  username: { type: String, minlength: 6, maxlength: 25, required: true },
  password: { type: String, minlength: 6, required: true },
  name: { type: String, trim: true },
  address: { type: String, trim: true },
  avatar: { type: String },
  facebook: { type: String, trim: true },
  email: { type: String, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
  gender: { type: String },
  status: { type: String },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  subscribes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  role: { type: String, required: true },
  permissions: [{ type: String }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userSchema);
