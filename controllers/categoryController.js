
const fs = require('fs');
const path = require('path');
const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  const { categoryName } = req.body;
  const categoryImage = req.file ? req.file.filename : null;

  try {
    const newCategory = await Category.create({ categoryName, categoryImage });
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;
  const categoryImage = req.file ? req.file.filename : null;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Save old category image path to delete later if a new one is provided
    const oldCategoryImagePath = category.categoryImage ? path.join(__dirname, '..', 'uploads', 'category', category.categoryImage) : null;

    // Update fields
    category.categoryName = categoryName || category.categoryName;
    if (categoryImage) {
      category.categoryImage = categoryImage;
    }

    await category.save();

    // Remove old category image if a new one was provided
    if (categoryImage && oldCategoryImagePath) {
      fs.unlink(oldCategoryImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete old category image: ${err.message}`);
        }
      });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (err) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Save category image path to delete later
    const categoryImagePath = category.categoryImage ? path.join(__dirname, '..', 'uploads', 'category', category.categoryImage) : null;

    await category.destroy();

    // Remove category image
    if (categoryImagePath) {
      fs.unlink(categoryImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete category image: ${err.message}`);
        }
      });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};
