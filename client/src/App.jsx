import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
// Components
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import IndividualUserView from './components/IndividualUserView'
import './index.css'
import NotFound from './components/NotFound'
import Users from './components/Users'

//! Stores
import { useActions, useUser } from './store/userStore'
import { useBlogActions } from './store/blogStore'

import { ErrorBoundary } from 'react-error-boundary'

import { Typography, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const user = useUser()
  const { initUser, logout } = useActions()
  const { initialize: initializeBlogs } = useBlogActions()

  useEffect(() => {
    initUser()
  }, [initUser])

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

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
              <Button color="inherit" component={Link} to="/users">
                Users
              </Button>
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>
              <Button color="inherit" onClick={logout}>
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

      <ErrorBoundary fallback={<h2>Something went wrong :( </h2>}>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<BlogList />} />

            <Route path="blogs/:id" element={<Blog />} />

            <Route path="/create" element={<CreateBlogForm />} />

            <Route path="/login" element={<LoginForm />} />

            <Route path="/users" element={<Users />} />

            <Route path="/users/:id" element={<IndividualUserView />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default App
