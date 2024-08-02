const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// User routes (requires authentication)
router.post('/orders', isAuthenticated, orderController.createOrder);
router.get('/orders/user/:userId', isAuthenticated, orderController.getOrdersByUser);
router.get('/orders/:orderId', isAuthenticated, orderController.getOrderById);
router.put('/orders/:orderId', isAuthenticated, orderController.updateOrder);
router.delete('/orders/:orderId', isAuthenticated, orderController.deleteOrder);

// Admin routes (requires admin privileges)
router.get('/admin/orders', isAuthenticated, isAdmin, orderController.getAllOrders);
router.delete('/admin/orders/:orderId', isAuthenticated, isAdmin, orderController.deleteOrderByAdmin);

module.exports = router;
