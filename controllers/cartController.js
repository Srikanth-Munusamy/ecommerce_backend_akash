const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// Add an item to the cart
exports.addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the item is already in the cart
    const existingCartItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // Add the product to the cart
      await Cart.create({
        userId,
        productId,
        quantity
      });
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding product to cart' });
  }
};

// Update item quantity in the cart
exports.updateCartItem = async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findByPk(cartId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating cart item' });
  }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cartItem = await Cart.findByPk(cartId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error removing cart item' });
  }
};

// View cart items for a user
exports.getUserCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [Product]
    });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};

// Clear the cart for a user
exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await Cart.destroy({ where: { userId } });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing cart' });
  }
};
