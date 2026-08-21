const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const plogRout = require('./controllers/blog')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')


const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => {logger.info('connected to MongoDB')}).catch((error) => {logger.error('error connection to MongoDB:', error.message)})

app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', plogRout)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// test path

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}



app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
