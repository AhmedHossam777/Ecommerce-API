require('express-async-errors');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateAccessToken } = require('../utils/generateJWT');

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

  const token = await generateAccessToken(newUser);

  res.status(201).json({
    status: 'success',
    username: username,
    email: email,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 400));
  }

  const token = await generateAccessToken(user);

  res.status(200).json({
    status: 'success',
    message: 'logged in successfully',
    token,
  });
};

const profileImageUpload = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    return next(new AppError('User does not exist', 400));
  }

  if (!req.file) {
    return next(new AppError('please upload an image', 400));
  }

  user.profilePhoto = req.file.path;
  await user.save();

  res.status(200).json({
    status: 'success',
    data: 'Photo uploaded successfully',
    user,
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
  const { username, email } = req.body;

  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    return next(new AppError('unAuthorized', 401));
  }

  user.username = username;
  user.email = email;

  await user.save();

  res.status(200).json({
    status: 'success',
    user,
  });
};

const changePassword = async (req, res, next) => {
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    return next(new AppError('unAuthorized', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('wrong password', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'password updated successfully',
  });
};
// const user = await User.findOne({ _id: req.user.id })

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
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
  updateUser,
  profileImageUpload,
  login,
  changePassword,
};
