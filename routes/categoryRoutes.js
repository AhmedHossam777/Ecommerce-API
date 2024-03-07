const express = require('express');

const {
  createCategory,
  getALlCAtegories,
  deleteCategory,
  updateCategory,
  getCategory,
} = require('../controllers/categoryController');

const router = express.Router();

router.route('/').get(getALlCAtegories).post(createCategory);

router
  .route('/:id')
  .delete(deleteCategory)
  .patch(updateCategory)
  .get(getCategory);

module.exports = router;
