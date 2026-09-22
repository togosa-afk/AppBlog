const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User } = require('../models/index')
const {SECRET} = require('../utils/config')

router.post('/', async (request, response) => {
  const { userName } = request.body

  const user = await User.findOne({ where: {userName }})

  if(!user){
    return response.status(401).json({
      error: "Invalid user name"
    })
  }

  const userForToken = {
    userName: user.userName,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 })

  response.status(200).send({ token, userName: user.userName, name: user.name })
})

module.exports = router
