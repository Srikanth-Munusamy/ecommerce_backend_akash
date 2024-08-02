const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const uploadMiddleware = require('../middlewares/uploadMiddleware')

// Register a new user
router.post('/register', uploadMiddleware.dpUpload.single('profilepic'), authController.register);

// Login a user
router.post('/login', authController.login);


module.exports = router;
