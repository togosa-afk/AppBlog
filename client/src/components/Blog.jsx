import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Box, Typography, Button, Link as MuiLink, Paper } from '@mui/material'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { useBlogs, useBlogActions } from '../store/blogStore'
import { useUser } from '../store/userStore'

const Blog = () => {
  const id = useParams().id
  const navigate = useNavigate()
  const blogs = useBlogs()
  const user = useUser()
  const { addLikes, deleteBlog } = useBlogActions()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const blog = blogs.find((blog) => blog && (blog.id || blog._id) === id)

  if (!blog) return <div>Blog not found</div>

  const blogId = blog.id || blog._id

  const isOwner = () => {
    if (!user) return false
    const blogUserId =
      typeof blog.user === 'string'
        ? blog.user
        : blog.user?.id || blog.user?._id
    const blogUserName = blog.user?.userName || blog.user?.username
    const userId = user.id || user._id
    return (
      String(blogUserId) === String(userId) ||
      (blogUserName && user.userName && blogUserName === user.userName)
    )
  }

  const handleDelete = async () => {
    await deleteBlog(blogId)
    navigate('/')
  }

  const addComment = (event) => {
    event.preventDefault()
    const trimmedComment = comment.trim()
    if (!trimmedComment) return

    setComments(comments.concat(trimmedComment))
    setComment('')
  }

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          maxWidth: 700,
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
              onClick={() => addLikes(blogId)}
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
              onClick={handleDelete}
              sx={{ textTransform: 'uppercase' }}
            >
              remove
            </Button>
          )}
        </Box>
        <Box component="section" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
            Comments
          </Typography>
          <Box
            component="form"
            onSubmit={addComment}
            sx={{
              display: 'flex',
              gap: 1,
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              label="Comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              size="small"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add comment
            </Button>
          </Box>
          <List disablePadding>
            {comments.map((currentComment, index) => (
              <ListItem key={`${currentComment}-${index}`} divider>
                <ListItemText primary={currentComment} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </>
  )
}

export default Blog
