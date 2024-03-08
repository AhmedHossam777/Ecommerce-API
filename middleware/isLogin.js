require('dotenv').config();

const User = require('../models/User');
const AppError = require('../utils/AppError');
const getTokenFromHeader = require('../utils/getTokenFromHeader');
const verifyToken = require('../utils/verifyToken');

const isLogin = async (req, res, next) => {
  const token = getTokenFromHeader();
  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }
  const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

  if (decoded === 'TokenExpiredError') {
    return next(new AppError('Token expired', 401));
  }

  if (!decoded) {
    return next(new AppError('Unauthorized', 401));
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(new AppError('Unauthorized', 401));
  }
  req.user = user;

  next();
};

module.exports = isLogin;
