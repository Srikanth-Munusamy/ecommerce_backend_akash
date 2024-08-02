const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  const { productName, productBrand, originalPrice, discountPrice, description, stock, isFeatured, subCategoryId } = req.body;
  const productImages = req.files ? req.files.map(file => file.filename) : [];

  try {
    const newProduct = await Product.create({
      productName,
      productBrand,
      originalPrice,
      discountPrice,
      description,
      stock,
      isFeatured,
      productImages,
      subCategoryId
    });

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, productBrand, originalPrice, discountPrice, description, stock, isFeatured, subCategoryId } = req.body;
  const productImages = req.files ? req.files.map(file => file.filename) : [];

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Save old product images path to delete later if new images are uploaded
    const oldProductImages = product.productImages ? product.productImages.split(',') : [];
    const oldProductImagesPaths = oldProductImages.map(image => path.join(__dirname, '..', 'uploads', 'product', image));

    // Update product fields
    product.productName = productName || product.productName;
    product.productBrand = productBrand || product.productBrand;
    product.originalPrice = originalPrice || product.originalPrice;
    product.discountPrice = discountPrice || product.discountPrice;
    product.description = description || product.description;
    product.stock = stock || product.stock;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.subCategoryId = subCategoryId || product.subCategoryId;

    // Update product images if new images are provided
    if (productImages.length > 0) {
      product.productImages = productImages.join(',');

      // Remove old images
      oldProductImagesPaths.forEach(imagePath => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Failed to delete product image: ${err.message}`);
          }
        });
      });
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Save product images path to delete
    const productImages = product.productImages ? product.productImages.split(',') : [];
    const productImagesPaths = productImages.map(image => path.join(__dirname, '..', 'uploads', 'product', image));

    await product.destroy();

    // Remove product images
    productImagesPaths.forEach(imagePath => {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete product image: ${err.message}`);
        }
      });
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};
