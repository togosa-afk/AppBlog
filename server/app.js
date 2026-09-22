// const express = require('express')
// const mongoose = require('mongoose')
// const path = require('path')
// const config = require('./utils/config')
// const logger = require('./utils/logger')
// const blogRout = require('./controllers/blog')
// const middleware = require('./utils/middleware')
// const usersRouter = require('./controllers/user')
// const loginRouter = require('./controllers/login')


// const app = express()

// mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => {logger.info('connected to MongoDB')}).catch((error) => {logger.error('error connection to MongoDB:', error.message)})

// app.use(express.json())
// app.use(middleware.requestLogger)
// app.use('/api/blogs', blogRout)
// app.use('/api/users', usersRouter)
// app.use('/api/login', loginRouter)

// // test path

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/testing', testingRouter)
// }

// if (process.env.NODE_ENV === 'production') {
//   const clientDistPath = path.join(__dirname, '../client/dist')

//   app.use(express.static(clientDistPath))
//   app.use((request, response, next) => {
//     if (request.method === 'GET' && !request.path.startsWith('/api')) {
//       return response.sendFile(path.join(clientDistPath, 'index.html'))
//     }

//     next()
//   })
// }


// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

// module.exports = app
