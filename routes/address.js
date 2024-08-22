const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController'); // Adjust path as necessary
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware'); // Adjust path as necessary

// User routes
router.post('/', isAuthenticated, addressController.createOrUpdateAddress); // Create or update address
router.get('/', isAuthenticated, addressController.getAddressByUserId); // Get address by userId
router.delete('/', isAuthenticated, addressController.deleteAddressByUserId); // Delete address by userId

// Admin routes
router.get('/addresses', isAuthenticated,isAdmin, addressController.getAllAddresses); // Get all addresses
router.get('/:userId',isAuthenticated, isAdmin, addressController.admingetAddressByUserId); // Get address by userId (admin)
router.delete('/:userId', isAuthenticated,isAdmin, addressController.admindeleteAddressByUserId); // Delete address by userId (admin)

module.exports = router;
