import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CreateBlogForm from './CreateBlogForm'
import { MemoryRouter } from 'react-router-dom'

const { create } = vi.hoisted(() => ({ create: vi.fn() }))

vi.mock('../services/blogs', () => ({
  default: { create },
}))

test('BlogForm testing', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <CreateBlogForm />
    </MemoryRouter>
  )

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'title test')
  await user.type(authorInput, 'author test')
  await user.type(urlInput, 'url test')

  await user.click(createButton)

  expect(create).toHaveBeenCalledTimes(1)

  expect(create).toHaveBeenCalledWith({
    title: 'title test',
    author: 'author test',
    url: 'url test',
  })
})
