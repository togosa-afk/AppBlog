const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {

  const where = {}

  if(req.query.read){
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'readings',
      attributes:{exclude: ['userId', 'createdAt', 'updatedAt']},
      through:{
        attributes:['read', 'id'],
        ...(Object.keys(where).length > 0 ? { where } : {})
      }
    }
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/',  async (req, res) => {
  const { name, username, userName, password } = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username: username || userName, name, passwordHash })
  return res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.name = req.body.name
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router