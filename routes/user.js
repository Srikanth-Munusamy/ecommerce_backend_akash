const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadMiddleware = require('../middlewares/uploadMiddleware')
const {isAuthenticated,isAdmin} = require('../middlewares/authMiddleware');

// Get user details (protected route)
router.get('/profile', isAuthenticated, userController.getUser);

// Update user profile with profile picture upload
router.put('/profile', isAuthenticated, uploadMiddleware.dpUpload.single('profilepic'), userController.updateProfile);

// Admin route to view all users
router.get('/users', isAuthenticated,isAdmin,  userController.getAllUsers);
router.get('/:id', isAuthenticated,isAdmin,  userController.getUserById);

module.exports = router;

