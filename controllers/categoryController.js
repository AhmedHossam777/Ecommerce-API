const Category = require('../models/Category');

const createCategory = async (req, res) => {
  const category = req.body;
  const newCategory = await Category.create(category);
  res.status(201).json(newCategory);
};

const getALlCAtegories = async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) {
    return;
  }
  res.status(200).json({
    status: 'success',
    categories,
  });
};

const getCategory = async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);

  if (!category) {
    return next(new Error('there is no category with that id '));
  }

  res.status(200).json({
    status: 'success',
    category
  })

};

const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const id = req.params.id;

  const category = await Category.findById(id);
  if (!category) {
    return next(new Error('there is no category with that id '));
  }

  const newCategory = await Category.findByIdAndUpdate(id, { name: name });

  res.status(200).json({
    status: 'success',
    newCategory,
  });
};

const deleteCategory = async (req, res, next) => {
  const id = req.params.id;

  const category = await Category.findById(id);
  if (!category) {
    return next(new Error('there is no category with that id '));
  }
  await Category.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    message: 'category deleted!',
  });
};

module.exports = {
  createCategory,
  getALlCAtegories,
  getCategory,
  deleteCategory,
  updateCategory,
};
