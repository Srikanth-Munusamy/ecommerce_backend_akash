const fs = require('fs');
const path = require('path');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

// Create a new sub-category
exports.createSubCategory = async (req, res) => {
  const { subCategoryName, categoryId } = req.body;
  const subCategoryImage = req.file ? req.file.filename : null;

  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newSubCategory = await SubCategory.create({
      subCategoryName,
      subCategoryImage,
      categoryId
    });

    res.status(201).json({ message: 'Sub-category created successfully', subCategory: newSubCategory });
  } catch (err) {
    res.status(500).json({ error: 'Error creating sub-category' });
  }
};


// Update a sub-category
exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { subCategoryName, categoryId } = req.body;
  const subCategoryImage = req.file ? req.file.filename : null;

  try {
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }

    // Save old sub-category image path to delete later if a new one is provided
    const oldSubCategoryImagePath = subCategory.subCategoryImage ? path.join(__dirname, '..', 'uploads', 'subcategory', subCategory.subCategoryImage) : null;

    // Update fields
    subCategory.subCategoryName = subCategoryName || subCategory.subCategoryName;
    subCategory.categoryId = categoryId || subCategory.categoryId;
    if (subCategoryImage) {
      subCategory.subCategoryImage = subCategoryImage;
    }

    await subCategory.save();

    // Remove old sub-category image if a new one was provided
    if (subCategoryImage && oldSubCategoryImagePath) {
      fs.unlink(oldSubCategoryImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete old sub-category image: ${err.message}`);
        }
      });
    }

    res.status(200).json({ message: 'Sub-category updated successfully', subCategory });
  } catch (err) {
    res.status(500).json({ error: 'Error updating sub-category' });
  }
};

// Delete a sub-category
exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }

    // Save sub-category image path to delete later
    const subCategoryImagePath = subCategory.subCategoryImage ? path.join(__dirname, '..', 'uploads', 'subcategory', subCategory.subCategoryImage) : null;

    await subCategory.destroy();

    // Remove sub-category image
    if (subCategoryImagePath) {
      fs.unlink(subCategoryImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete sub-category image: ${err.message}`);
        }
      });
    }

    res.status(200).json({ message: 'Sub-category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting sub-category' });
  }
};

// Get all sub-categories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll();
    res.status(200).json(subCategories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching sub-categories' });
  }
};

// Get a single sub-category by ID
exports.getSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findByPk(id, { include: Category });
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching sub-category' });
  }
};
