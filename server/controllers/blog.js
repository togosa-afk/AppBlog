const router = require('express').Router()
const { Blog, User } = require('../models')
const {SECRET} = require('../utils/config')
const {Op} = require('sequelize')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {

  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or]=[
    {
      title:{ [Op.iLike] : `%${req.query.search}%` }
    },
    {
      author: {[Op.iLike] : `%${req.query.search}%`}
    }
  ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'userName']
    },
    where,
    order:[['likes','DESC']]
  })

  res.json(blogs)
})

router.post('/',tokenExtractor, async (req, res) => {
  try{
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    return res.json(blog)
  } catch (error) {
    res.status(400).json({error})
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id',tokenExtractor, blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id',tokenExtractor, blogFinder, async (req, res) => {

  if(req.blog.userId !== req.decodedToken.id ){
    return res.status(401).json({ error: 'only the creator can delete this blog' })
  }
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router