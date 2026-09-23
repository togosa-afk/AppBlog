const router = require('express').Router()
const { sequelize } = require('../utils/db')

router.post('/reset', async (request, response) => {
  await sequelize.query(
    'TRUNCATE TABLE blogs, users, reading_lists, active_sessions RESTART IDENTITY CASCADE;'
  )

  response.status(204).end()
})

module.exports = router