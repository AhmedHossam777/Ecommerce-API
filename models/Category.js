const mongoose = require('mongoose');
const validator = require('validator');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true,
    trim: true,
    maxlength: [20, 'Name must be less than 20 characters'],
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;