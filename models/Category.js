const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    categoryImage: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Category;
