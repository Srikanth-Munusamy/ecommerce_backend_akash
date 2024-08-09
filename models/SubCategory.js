const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category'); // Import the Category model

const SubCategory = sequelize.define('SubCategory', {
    subCategoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    subCategoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subCategoryImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    categoryId: { // Foreign key for category
        type: DataTypes.INTEGER,
        references: {
            model: Category, // 'subCategories' would be the name of the table
            key: 'categoryId',
        },
        allowNull: false, // Make sure the product is associated with a category
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
// Set up association
Category.hasMany(SubCategory, { foreignKey: 'categoryId'});

SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = SubCategory;
