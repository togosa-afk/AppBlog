require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || 'postgres://postgres:example@localhost:5432/blogapp',
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET || 'supersecret'
}