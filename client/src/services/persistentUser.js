import blogService from '../services/blogs'

const saveUser = ( user ) => {
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    blogService.setToken(user.token)
}

const removeUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
}

const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return user
  }
  return null
}

export default {saveUser, removeUser, getUser }