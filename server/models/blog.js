const { DataTypes, Model } = require('sequelize')
const {sequelize} = require('../utils/db')
class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author:{
    type: DataTypes.TEXT
  },
  url:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  title:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes:{
    type: DataTypes.INTEGER,
    defaultValue: 0
  },      
  created_at:{
    type: DataTypes.DATE,
    allowNull:false
  },
  updated_at:{
    type: DataTypes.DATE,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: [1991],
        msg: 'Year must be at least 1991'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: `Year cannot be greater than the current year (${new Date().getFullYear()})`
      }
    }
  }
},{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog
