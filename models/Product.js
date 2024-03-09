const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Product must have a name'],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, 'Product must have a price'],
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: [true, 'Product must have a category'],
	},
	image: {
		type: String,
	},
	description: {
		type: String,
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;