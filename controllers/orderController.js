const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, totalAmount, status, shippingAddress } = req.body;
    
    const order = await Order.create({
      userId,
      totalAmount,
      status,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'orderItems' }],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'orderItems' }],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

// Update order details
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, shippingAddress } = req.body;

    const [updated] = await Order.update(
      { status, shippingAddress },
      { where: { orderId } }
    );

    if (updated) {
      const updatedOrder = await Order.findByPk(orderId);
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deleted = await Order.destroy({ where: { orderId } });

    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: OrderItem });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Admin: Delete an order
exports.deleteOrderByAdmin = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.destroy();
    res.status(200).json({ message: 'Order deleted successfully by admin' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting order by admin' });
  }
};