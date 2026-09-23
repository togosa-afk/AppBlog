import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useBlogs } from '../store/blogStore'
import { useUser, useUserInitialized } from '../store/userStore'

// Components
import Notification from './Notification'
import '../index.css'
const BlogList = () => {
  const blogs = useBlogs()
  const user = useUser()
  const userInitialized = useUserInitialized()

  const SortedBlog = [...blogs].sort((a, b) => b.likes - a.likes)

  const navigate = useNavigate()

  useEffect(() => {
    if (userInitialized && !user) {
      navigate('/login')
    }
  }, [user, userInitialized, navigate])

  if (!userInitialized || !user) {
    return <div>Loading...</div>
  }
  // Ensure the owner of the blog or not
  const isOwner = (blog) => {
    if (!user) return false
    const blogUserId =
      typeof blog.user === 'string'
        ? blog.user
        : blog.user?.id || blog.user?._id
    const blogUserName = blog.user?.username || blog.user?.userName
    return (
      blogUserId === user.id ||
      blogUserName === user.username ||
      blogUserName === user.userName
    )
  }

  return (
    <>
      <h2>blogs</h2>
      <Notification />
      <p>{user.name} is logged in</p>
      <ul>
        {SortedBlog.map((blog) => (
          <li
            key={blog.id || blog._id}
            onClick={() => navigate(`/blogs/${blog.id || blog._id}`)}
          >
            <Link to={`/blogs/${blog.id || blog._id}`}>
              <h3>{blog.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BlogList
