const {
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
  profileImageUpload,
  login,
  changePassword,
  forgetPassword,
  resetPassword,
  refreshToken
} = require('../controllers/userController');
const storage = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({ storage });

const express = require('express');
const isLogin = require('../middleware/isLogin');
const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/:id').delete(deleteUser).get(getUser);
router.route('/update-user').patch(isLogin, updateUser);
router.route('/update-password-user').patch(isLogin, changePassword);

router.route('/register').post(registerUser);
router.route('/login').post(login);

router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:token').patch(resetPassword);
router.route('/refresh-token').post(refreshToken);

router
  .route('/upload')
  .post(isLogin, upload.single('profile'), profileImageUpload);

module.exports = router;
