import { Link, useParams } from 'react-router-dom'
import { useBlogs } from '../store/blogStore'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

const IndividualUserView = () => {
  const { id } = useParams()
  const blogs = useBlogs()
  const userBlogs = blogs.filter((blog) => {
    const blogUserId =
      typeof blog.user === 'string'
        ? blog.user
        : blog.user?.id || blog.user?._id
    const blogUserName = blog.user?.userName || blog.author

    return String(blogUserId) === String(id) || blogUserName === id
  })
  const user = userBlogs[0]?.user
  const userName = user?.name || userBlogs[0]?.author || id

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
        {userName}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Added blogs
      </Typography>
      <Paper elevation={2}>
        <List disablePadding>
        {userBlogs.map((blog) => (
          <ListItem key={blog.id || blog._id} divider>
            <ListItemText
              primary={
                <Link component={Link} to={`/blogs/${blog.id || blog._id}`}>
                  {blog.title}
                </Link>
              }
              secondary={`${blog.likes} likes`}
            />
          </ListItem>
        ))}
        </List>
      </Paper>
    </Container>
  )
}

export default IndividualUserView
