const multer = require('multer');
const path = require('path');

// Multer configuration for profile pictures
const dpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/dp/'); // Directory for category images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'dp-' + uniqueSuffix + path.extname(file.originalname));
  }
});const dpUpload = multer({ storage: dpStorage });

// Multer configuration for category images
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/category/'); // Directory for category images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const categoryUpload = multer({ storage: categoryStorage });
// Multer configuration for sub category images
const subCategoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/subcategory/'); // Directory for category images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'subcategory-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const subCategoryUpload = multer({ storage: subCategoryStorage });

// Multer configuration for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product/'); // Directory for product images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const productUpload = multer({ storage: productStorage });

module.exports = {
  dpUpload,
  categoryUpload,
  subCategoryUpload,
  productUpload
};
