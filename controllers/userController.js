const User = require('../models/User');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const dupUser = await User.findOne({ email: email });
  if (dupUser) {
    return next(new Error('user already exist'));
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
