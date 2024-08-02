const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

// Add items to an order
exports.addOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity, unitPrice } = req.body;
    
    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const orderItem = await OrderItem.create({
      orderId,
      productId,
      quantity,
      unitPrice,
    });

    res.status(201).json(orderItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add order item' });
  }
};

// Update an order item
exports.updateOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { quantity, unitPrice } = req.body;

    const [updated] = await OrderItem.update(
      { quantity, unitPrice },
      { where: { orderItemId } }
    );

    if (updated) {
      const updatedOrderItem = await OrderItem.findByPk(orderItemId);
      res.status(200).json(updatedOrderItem);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order item' });
  }
};

// Remove an item from an order
exports.removeOrderItem = async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const deleted = await OrderItem.destroy({ where: { orderItemId } });

    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove order item' });
  }
};
// Admin: Get all order items
exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order items' });
  }
};

// Admin: Delete an order item
exports.deleteOrderItemByAdmin = async (req, res) => {
  const { orderItemId } = req.params;

  try {
    const orderItem = await OrderItem.findByPk(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    await orderItem.destroy();
    res.status(200).json({ message: 'Order item deleted successfully by admin' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting order item by admin' });
  }
};