const express = require('express');

const {
	getAllProducts,
	deleteProduct,
	updateProduct,
	getProduct,
	createProduct
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct);

module.exports = router;