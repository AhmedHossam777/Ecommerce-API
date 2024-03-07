
const {registerUser} = require('../services/userService');

const express = require('express');
const router = express.Router();

router.post('/register', registerUser);

module.exports = router;