const logger = require('./logger')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../utils/config')
const {User , Session} = require('../models')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, SECRET)

      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'token revoked or session expired' })
      }

      const user = await User.findByPk(decodedToken.id)
      if (!user || user.disabled) {
        return res.status(401).json({ error: 'user disabled or not found' })
      }

      req.decodedToken = decodedToken
      req.token = token
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {

    return response.status(400).send({ error: 'malformatted id' })
  
  } else if (error.name === 'ValidationError') {
  
    return response.status(400).json({ error: error.message })
  
  }else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
  
    return response.status(400).json({ error: 'expected `username` to be unique' })
  
  } else if (error.name === 'JsonWebTokenError') {
  
    return response.status(401).json({ error: 'token invalid' })
  
  } else if (error.name === 'TokenExpiredError') {
  
    return response.status(401).json({
  
      error: 'token expired'
  
    })
  
  } else if (error.name === 'SequelizeValidationError'){
    return response.status(400).json({ 
      error: error.errors.map(e => e.message) 
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}