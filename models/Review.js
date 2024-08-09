const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Review = sequelize.define('Review', {
  reviewId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: User,
    key: 'userId',
  },
  onDelete: 'CASCADE',
},

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'productId',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
});

User.hasMany(Review, { foreignKey: 'userId'});
Review.belongsTo(User, { foreignKey: 'userId'});

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Review;
