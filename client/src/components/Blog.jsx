import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Link as MuiLink, Paper } from '@mui/material'

import blogService from '../services/blogs'

const Blog = ({ blogs, setBlogs, user }) => {
  const [visible, setVisible] = useState(false)
  const id = useParams().id
  const navigate = useNavigate()
  const blog = blogs.find((blog) => (blog.id || blog._id) === id)

  if (!blog) return <div>Blog not found</div>

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handelLike = async () => {
    const blogToUpdate = {
      user: blog.user?.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    const updated = await blogService.update(blog.id || blog._id, blogToUpdate)
    setBlogs(
      blogs.map((blog) => ((blog.id || blog._id) === id ? updated : blog))
    )
  }

  const handelDelete = async () => {
    if (window.confirm(`Remove blog '${blog.title}' by '${blog.author}'?`)) {
      await blogService.remove(blog.id || blog._id)
      setBlogs(blogs.filter((blog) => (blog.id || blog._id) !== id))
      navigate('/')
    }
  }

  const isOwner = () => {
    if (!user) return false
    const blogUserId =
      typeof blog.user === 'string'
        ? blog.user
        : blog.user?.id || blog.user?._id
    const blogUserName = blog.user?.userName || blog.user?.username
    const userId = user.id || user._id
    return (
      String(blogUserId) === String(userId) || blogUserName === user.userName
    )
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" component="h2" sx={{ fontWeight: 500, mb: 1 }}>
          {blog.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <MuiLink
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
          >
            {blog.url}
          </MuiLink>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          added by {blog.user?.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {blog.likes} likes
          </Typography>

          {user && (
            <Button
              variant="outlined"
              size="small"
              onClick={handelLike}
              sx={{ textTransform: 'uppercase' }}
            >
              like
            </Button>
          )}

          {isOwner() && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handelDelete}
              sx={{ textTransform: 'uppercase' }}
            >
              remove
            </Button>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default Blog
