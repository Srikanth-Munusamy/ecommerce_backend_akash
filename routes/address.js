const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController'); // Adjust the path to your controller
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Create a new address (requires authentication)
router.post('/', isAuthenticated, addressController.createAddress);

// Get all addresses for a user (requires authentication)
router.get('/user/:userId', isAuthenticated, addressController.getAddressesByUser);

// Get a single address by ID (requires authentication)
router.get('/:addressId', isAuthenticated, addressController.getAddressById);

// Update an address by ID (requires authentication)
router.put('/:addressId', isAuthenticated, addressController.updateAddress);

// Delete an address by ID (requires authentication)
router.delete('/:addressId', isAuthenticated, addressController.deleteAddress);

// Admin routes (requires admin privileges)
router.get('/admin/addresses', isAuthenticated, isAdmin, addressController.getAllAddresses);
router.delete('/admin/addresses/:addressId', isAuthenticated, isAdmin, addressController.deleteAddressByAdmin);

module.exports = router;
