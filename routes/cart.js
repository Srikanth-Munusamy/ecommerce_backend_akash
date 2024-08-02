const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {isAuthenticated,isAdmin} = require('../middlewares/authMiddleware');

// Add an item to the cart
router.post('/', isAuthenticated, cartController.addItemToCart);

// Update item quantity in the cart
router.put('/:cartId', isAuthenticated, cartController.updateCartItem);

// Remove an item from the cart
router.delete('/:cartId', isAuthenticated, cartController.removeCartItem);

// View cart items for the logged-in user
router.get('/', isAuthenticated, cartController.getUserCart);

// Clear the cart for the logged-in user
router.delete('/', isAuthenticated, cartController.clearCart);

module.exports = router;
