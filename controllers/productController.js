const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const SubCategory = require('../models/SubCategory');

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
  const productId = req.params.id;
    
const { productName, productBrand, originalPrice, discountPrice, description, stock, isFeatured, subCategoryId } = req.body;
  
  try {
    const product = await Product.findOne({ where: { productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product fields
    
    let updatedImages = req.files && req.files.length > 0 ? req.files.map(file => file.filename) :product.productImages;
   
    const updatedFields = {
   
    productName : productName || product.productName,
    productBrand : productBrand || product.productBrand,
    originalPrice : originalPrice || product.originalPrice,
    discountPrice : discountPrice || product.discountPrice,
    description : description || product.description,
    stock : stock || product.stock,
    isFeatured : isFeatured !== undefined ? isFeatured : product.isFeatured,
    subCategoryId : subCategoryId || product.subCategoryId,
    productImages: updatedImages,
   
    }

    const isProductUpdated = await Product.update(
      updatedFields,
      { where: { productId: productId } }
    );
    if (isProductUpdated[0] === 1) {
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < product.productImages?.length; i++) {
          const deletePath = "../uploads/product/" + product.productImages[i];
          fs.unlinkSync(path.join(__dirname, deletePath));
        }
      }
      return res.status(200).json({ message: 'Product updated successfully' });
    }
    return res.status(200).json({ message: "Product not found", isUpdated: isProductUpdated[0] });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findOne({ where: { productId } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.productImages) {
      for( let i=0;i<product.productImages?.length;i++){
        const deletePath = "../uploads/product/" +product.productImages[i];
           fs.unlinkSync(path.join(__dirname, deletePath));
      }
      
    }
    await Product.destroy({ where: { productId } });

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: SubCategory},
    });
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
