const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')
const {tokenExtractor} = require('../utils/middleware')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  if (!blogId || !userId) {
    return res.status(400).json({ error: 'blogId and userId are required' })
  }

  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if (!user || !blog) {
    return res.status(404).json({ error: 'User or Blog not found' })
  }

  const existing = await ReadingList.findOne({ where: { userId, blogId } })
  if (existing) {
    return res.status(400).json({ error: 'Blog already in reading list' })
  }

  const readingListEntry = await ReadingList.create({
    userId,
    blogId
  })

  res.json(readingListEntry)
})

router.put('/:id', tokenExtractor, async (req ,res) =>{
  const readingList = await ReadingList.findByPk(req.params.id)

  if(!readingList){
    return res.status(404).json({error: 'Blog not found'})
  }

  if(readingList.userId !== req.decodedToken.id){
    return res.status(401).json({error: 'Only the owner can update their reading list'})
  }

  readingList.read = req.body.read
  await readingList.save()

  res.json(readingList)
})

module.exports = router