const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubCategory = require('./SubCategory'); // Import the SubCategory model

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productBrand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discountPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productImages: {
        type: DataTypes.JSON, // Store multiple images as a JSON array
        allowNull: true,
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    subCategoryId: { // Foreign key for subcategory
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory, // 'subCategories' would be the name of the table
            key: 'subCategoryId',
        },
        allowNull: false, // Make sure the product is associated with a subcategory
    }
}, {
    timestamps: true,
});

// Set up association
Product.belongsTo(SubCategory, { foreignKey: "subCategoryId" });
SubCategory.hasMany(Product, { foreignKey: "subCategoryId" });

module.exports = Product;
