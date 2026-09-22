const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail:{
        msg:"username must be a valid email address"
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User