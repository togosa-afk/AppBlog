import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'

import { TextField, Button } from '@mui/material'

const LoginForm = ({ setUser }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ userName, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
      setPassword('')
      setUserName('')
    } catch (error) {
      // console.log('Login failed:', error.response?.data || error.message)
      setType('error')
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  // to set values for username and password in the login form
  const onChange = (event) => {
    const { id, value } = event.target
    if (id === 'userName') {
      setUserName(value)
    } else if (id === 'password') {
      setPassword(value)
    }
  }

  const margin = { margin: 1 }

  // throw new Error('خازوق تجريبي لاختبار الـ Error Boundary!')
  return (
    <>
      <Notification message={message} type={type} />
      <h1>Login to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            type="text"
            id="userName"
            variant="standard"
            sx={margin}
            value={userName}
            onChange={onChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            id="password"
            variant="standard"
            sx={margin}
            value={password}
            onChange={onChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <Button type="submit" sx={margin} variant="contained">
          login
        </Button>
      </form>
    </>
  )
}
export default LoginForm
