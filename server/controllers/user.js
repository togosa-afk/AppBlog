const router = require('express').Router()
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
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog
    }
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/',  async (req, res) => {
  const {name , userName} = req.body
  const user = await User.create({ userName, name })
  return res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      userName: req.params.username
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