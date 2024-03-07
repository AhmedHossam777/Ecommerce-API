const Category = require('../models/Category');

const createCategory = async (req, res) => {
  const category = req.body;
  const newCategory = await Category.create(category);
  res.status(201).json(newCategory);
};

module.exports = { createCategory };
