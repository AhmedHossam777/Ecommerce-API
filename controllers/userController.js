require('express-async-errors');

const User = require('../models/User');
const AppError = require('../utils/AppError');

const registerUser = async (req, res, next) => {
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

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError('there is no users yet', 404));
  }
  res.status(200).json({
    status: 'success',
    users,
  });
};

const getUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('user does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    user,
  });
};

const updateUser = async (req, res, next) => {
  //! add isLogin middleware before
  const id = req.params.id;
  const { username, email, password } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('user does not exist', 404));
  }

  const newUser = await User.findByIdAndUpdate(id, {
    username: username,
    email: email,
    password: password,
  });

  await newUser.save();
  res.status(200).json({
    status: 'success',
    newUser,
  });
};

const deleteUser = async (req, res, next) => {
  const id = re.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('user does not exist', 404));
  }
  await User.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  registerUser,
  getAllUsers,
  deleteUser,
  getUser,
  updateUser
};
