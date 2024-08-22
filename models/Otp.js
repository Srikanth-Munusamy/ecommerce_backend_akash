const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User')

const Otp = sequelize.define('Otp', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId'
    }
  },
  otpCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // 'registration' or 'password_reset'
  }
}, {
  timestamps: true,
});


User.hasMany(Otp, { foreignKey: 'userId' });
Otp.belongsTo(User, { foreignKey: 'userId' });

module.exports = Otp;
