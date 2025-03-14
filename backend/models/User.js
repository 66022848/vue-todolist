const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
  },
  points: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);