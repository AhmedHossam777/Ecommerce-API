require('express-async-errors');

const User = require('../models/User');
const AppError = require('../utils/AppError');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const dupUser = await User.findOne({ email: email });

  if (dupUser) {
    return next(new AppError('user already exist', 400));
  }
  const newUser = await User.create({
    username: username,
    email: email,
    password: password,
  });
  res.status(201).json({
    status: 'success',
    newUser,
  });
};

module.exports = {
  registerUser,
};
