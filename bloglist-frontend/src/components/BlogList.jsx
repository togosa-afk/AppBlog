import { useNavigate, Link } from 'react-router-dom'
import {useEffect, useState } from 'react'


// Components
import Blog from './Blog'
import Notification from './Notification'
import '../index.css'
// services
import blogService from '../services/blogs'

const BlogList = ({ blogs, user, handleLogout }) => {
  

  const [message, setMessage] = useState(null)
  const [type, setType] = useState('')
  const SortedBlog = [...blogs].sort((a, b) => b.likes - a.likes)

  const navigate = useNavigate()

  useEffect(() => {
      if (!user) {
          navigate('/login')
      }
  }, [user, navigate])


  if (!user) {
  return <div>Loading...</div>
  }
  // Ensure the owner of the blog or not 
  const isOwner = (blog) => {
      if (!user) return false
      const blogUserId = typeof blog.user === 'string'
      ? blog.user
      : (blog.user?.id || blog.user?._id)
      const blogUserName = blog.user?.userName || blog.user?.username
      return blogUserId === user.id || blogUserName === user.userName
  }



  return (
    <>
      <h2>blogs</h2>
      <Notification message={message} type={type} />
      <p>{user.name} is logged in</p>
      <ul>
        {SortedBlog.map(blog =>
          <li key={blog.id || blog._id} onClick={()=> navigate(`/blogs/${blog.id || blog._id}`)}>
            <Link>
              <h3>{blog.title}</h3>
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}

export default BlogList