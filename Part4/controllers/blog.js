require('dotenv').config()
const plogRout = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

plogRout.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { userName: 1, name: 1 })

  response.json(blogs)
})


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

//post

plogRout.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await savedBlog.populate('user', { userName: 1, name: 1 })
  await user.save()
  response.status(201).json(savedBlog)
})


plogRout.delete('/:id', async (request, response) => {

  // add auth to delete only if the user is the creator of the blog
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})


plogRout.put('/:id', async (request, response, next) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const savedBlog = await blog.save()
  const updatedBlog = await savedBlog.populate('user', { userName: 1, name: 1 })
  response.status(200).json(updatedBlog)
})

module.exports = plogRout;
