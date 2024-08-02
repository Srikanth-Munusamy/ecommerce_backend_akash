const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {isAuthenticated,isAdmin} = require('../middlewares/authMiddleware');

// Admin routes (protected)
router.post('/', isAuthenticated, isAdmin,uploadMiddleware.productUpload.array('productImages', 10), productController.createProduct);
router.put('/:id', isAuthenticated, isAdmin,uploadMiddleware.productUpload.array('productImages', 10), productController.updateProduct);
router.delete('/:id', isAuthenticated, isAdmin,productController.deleteProduct);

// User and Admin routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
