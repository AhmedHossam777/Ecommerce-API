const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email : {
    type : String,
    required: [true, 'Please provide an email'],
  },
  password: {

  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;