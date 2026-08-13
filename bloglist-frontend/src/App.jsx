import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
// Components
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import './index.css'

import {Typography, AppBar, Toolbar, Button} from '@mui/material'

// services 
import blogService from './services/blogs'
const App = () => {

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  //! handel logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }



  // add Blog function
  const createBlog = async (blogObj) => {
    try {
      const blog = await blogService.create(blogObj)
      setBlogs(blogs.concat(blog))
    } catch (error) {
      console.error('Blog creation failed:', error)
    }
  }


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>

          {user ? (
            <>
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path='/' element={
          <BlogList blogs={blogs} user={user} handleLogout={handleLogout} />
        } />

        <Route path='blogs/:id' element={
          <Blog blogs={blogs} setBlogs={setBlogs} user={user}  />
        } />

        <Route path='/create' element={
          <CreateBlogForm user={user} blogs={blogs} setBlogs={setBlogs} createBlog={createBlog} />
        } />


        <Route path='/login' element={
          <LoginForm setUser={setUser} />
        } />
      </Routes>

    </>
  )
}

export default App