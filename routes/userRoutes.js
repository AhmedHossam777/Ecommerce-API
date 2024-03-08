const {
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
  profileImageUpload,
  login,
} = require('../controllers/userController');
const storage = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({ storage });

const express = require('express');
const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/:id').delete(deleteUser).get(getUser).patch(updateUser);

router.route('/register').post(registerUser);
router.route('/login').post(login);

router.route('/upload').post(upload.single('profile'), profileImageUpload);

module.exports = router;
