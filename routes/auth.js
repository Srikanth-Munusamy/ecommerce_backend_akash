const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Register a new user
router.post('/register', uploadMiddleware.dpUpload.single('profilepic'), authController.register);

// Verify OTP for registration
router.post('/verify-otp', authController.verifyOtp);

// Login a user
router.post('/login', authController.login);

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password with OTP
router.post('/reset-password', authController.resetPassword);

// Resend OTP for account activation or password reset
router.post('/resend-otp', authController.resendOtp);

module.exports = router;
