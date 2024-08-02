const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// User routes (requires authentication)
router.post('/order-items', isAuthenticated, orderItemController.addOrderItem);
router.put('/order-items/:orderItemId', isAuthenticated, orderItemController.updateOrderItem);
router.delete('/order-items/:orderItemId', isAuthenticated, orderItemController.removeOrderItem);

// Admin routes (requires admin privileges)
router.get('/admin/order-items', isAuthenticated, isAdmin, orderItemController.getAllOrderItems);
router.delete('/admin/order-items/:orderItemId', isAuthenticated, isAdmin, orderItemController.deleteOrderItemByAdmin);

module.exports = router;
