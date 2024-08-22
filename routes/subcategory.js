const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {isAuthenticated ,isAdmin}= require('../middlewares/authMiddleware');

// Admin routes (protected)
router.post('/', isAuthenticated,isAdmin, uploadMiddleware.subCategoryUpload.single('subCategoryImage'), subCategoryController.createSubCategory);
router.put('/:id', isAuthenticated,isAdmin, uploadMiddleware.subCategoryUpload.single('subCategoryImage'), subCategoryController.updateSubCategory);
router.delete('/:id', isAuthenticated,isAdmin, subCategoryController.deleteSubCategory);

// User and Admin routes
router.get('/',subCategoryController.getAllSubCategories);
router.get('/:id',subCategoryController.getSubCategoryById);

module.exports = router;
