import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Notification from './Notification'
import { useActions } from '../store/userStore'

import { TextField, Button } from '@mui/material'

const LoginForm = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useActions()

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const credentials = { username: userName, password }
      await login(credentials)
      navigate('/')
      setPassword('')
      setUserName('')
    } catch (error) {
      // setError(error.response?.data?.error || 'wrong credentials')
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
      {/* <Notification /> */}
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
