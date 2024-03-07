const {
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
} = require('../controllers/userController');

const express = require('express');
const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/:id').delete(deleteUser).get(getUser).patch(updateUser);

router.route('/register').post(registerUser);

module.exports = router;
