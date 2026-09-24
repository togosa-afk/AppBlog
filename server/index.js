const express = require('express')
const app = express()
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
const authorRoute = require('./controllers/author')
const loginRoute = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const readingListRouter = require('./controllers/reading_lists')
app.use(express.json())

if (process.env.TESTING === 'true') {
  const testingRouter = require('./controllers/testing')
  app.use('/api', testingRouter)
}

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorRoute)
app.use('/api/login', loginRoute)
app.use('/api/logout', logoutRouter)
app.use('/api/readinglists', readingListRouter)



const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } 
  
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'invalid data format' })
  }

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
  return res.status(400).json({ 
    error: error.errors.map(e => e.message)
  })
  
}

  next(error)
}

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

if (require.main === module) {
  start()
}

process.on('unhandledRejection', (reason) => console.error('❌ Unhandled Rejection:', reason))
process.on('uncaughtException', (err) => console.error('❌ Uncaught Exception:', err))

module.exports = app