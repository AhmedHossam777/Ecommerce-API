const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const getAllProducts = async (req, res, next) => {
	const products = await Product.find();
	if (!products) {
		return next(new AppError('there is no product yet', 404));
	}
	
	res.status(200).json({
		status: 'success',
		products
	});
};

const createProduct = async (req, res, next) => {
	const productData = req.body;
	if (!productData) {
		return next(new AppError('please provide data for the product', 400));
	}
	
	const product = await Product.create(productData);
	
	res.status(201).json({
		status: 'success',
		product
	});
};

const getProduct = async (req, res, next) => {
	const productId = req.params.id;
	if (!productId) return next(new AppError('please insert the id', 400));
	
	const product = await Product.findById(productId);
	if (!product) return next(new AppError('there no product with that id', 404));
	
	res.status(200).json({
		status: 'success',
		product
	});
};


const updateProduct = async (req, res, next) => {
	const newData = req.body;
	
	const productId = req.params.id;
	if (!productId) return next(new AppError('please insert the id', 400));
	
	const product = await Product.findById(productId);
	if (!product) return next(new AppError('there no product with that id', 404));
	
	const newProduct = await Product.findByIdAndUpdate(productId, newData, { new: true, runValidators: true });
	
	res.status(200).json({
		status: 'success',
		newProduct
	});
};

const deleteProduct = async (req, res, next) => {
	const productId = req.params.id;
	if (!productId) return next(new AppError('please insert the id', 400));
	
	const product = await Product.findById(productId);
	if (!product) return next(new AppError('there no product with that id', 404));
	
	await Product.findByIdAndDelete(productId);
	
	res.status(204).json({
		status: 'success',
		message: 'product is deleted successfully'
	});
};

module.exports = {
	getAllProducts,
	createProduct,
	getProduct,
	updateProduct,
	deleteProduct
};