import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBlogActions } from '../store/blogStore'

import Notification from './Notification'
import { TextField, Button } from '@mui/material'

const CreateBlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  const { addBlog } = useBlogActions()

  const onChange = (event) => {
    const { id, value } = event.target
    if (id === 'title') {
      setTitle(value)
    } else if (id === 'author') {
      setAuthor(value)
    } else if (id === 'url') {
      setUrl(value)
    }
  }

  const margin = { margin: 1 }

  const buttonStyle = {
    bgcolor: 'rgb(29, 29, 236)',
  }

  const handelCreateBlog = async (event) => {
    event.preventDefault()
    const newObject = {
      title: title,
      author: author,
      url: url,
    }
    await addBlog(newObject)
    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <Notification />
      <h2>Create new blog</h2>
      <form onSubmit={handelCreateBlog}>
        <div className="title">
          <TextField
            className="titleInput"
            sx={margin}
            id="title"
            type="text"
            value={title}
            onChange={onChange}
            placeholder="title"
            required
          />
        </div>
        <div className="author">
          <TextField
            id="author"
            type="text"
            sx={margin}
            value={author}
            onChange={onChange}
            placeholder="author"
            required
          />
        </div>
        <div className="url">
          <TextField
            id="url"
            type="text"
            sx={margin}
            value={url}
            onChange={onChange}
            placeholder="url"
            required
          />
        </div>
        <Button type="submit" variant="contained" className="create">
          create
        </Button>
      </form>
    </>
  )
}

export default CreateBlogForm
