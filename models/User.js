const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    const isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // create random token with the 32 character and hex encoding

  this.passwordResetToken = crypto // start to encrypt the token in database
    .createHash('sha256') // the algorithm that will be using in the encryption
    .update(resetToken) // pass to update the token u want to encrypt
    .digest('hex'); // the encoding of the token

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
