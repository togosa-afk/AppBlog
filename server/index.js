const express = require('express')
require('express-async-errors')
const app = express()
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
const authorRoute = require('./controllers/author')
const loginRoute = require('./controllers/login')

app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('api/author', authorRoute)
app.use('/api/login', loginRoute)

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

start()