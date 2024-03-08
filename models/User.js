const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    validate: [validator.isEmail, 'please enter a valid email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    min: 6,
    select: false,
  },
  profilePhoto: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    const isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
  } catch (error) {
    return next(error)
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
