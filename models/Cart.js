const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  cartId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Ensure this matches the table name in the database
      key: 'userId'
    },
    onDelete: 'CASCADE', // Optional: To handle related records if a user is deleted
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products', // Ensure this matches the table name in the database
      key: 'productId'
    },
    onDelete: 'CASCADE', // Optional: To handle related records if a product is deleted
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: true,
 });

// Associations
User.hasMany(Cart, { foreignKey: 'userId'});
Cart.belongsTo(User, { foreignKey: 'userId'});

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Cart;
