const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {isAuthenticated ,isAdmin}= require('../middlewares/authMiddleware');

// Admin routes (protected)
router.post('/', isAuthenticated,isAdmin, uploadMiddleware.categoryUpload.single('categoryImage'), categoryController.createCategory);
router.put('/:id', isAuthenticated,isAdmin, uploadMiddleware.categoryUpload.single('categoryImage'), categoryController.updateCategory);
router.delete('/:id', isAuthenticated,isAdmin, categoryController.deleteCategory);

// User and Admin routes
router.get('/',isAuthenticated ,categoryController.getAllCategories);
router.get('/:id', isAuthenticated,categoryController.getCategoryById);

module.exports = router;
