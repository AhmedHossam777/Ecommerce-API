const User = require('../models/User');

const registerUser = async (req, res) => {
  const user = req.body;
  const newUser = await User.create(user);
  res.status(201).json(newUser);
};




module.exports = {
  registerUser
}
