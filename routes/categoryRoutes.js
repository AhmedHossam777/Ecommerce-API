const express = require('express');

const { createCategory } = require('../services/categoryService');

const router = express.Router();

router.post('/category', createCategory);

module.exports = router;
