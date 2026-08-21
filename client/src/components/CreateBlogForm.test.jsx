import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CreateBlogForm from './CreateBlogForm'

test('BlogForm testing', async ()=>{
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<CreateBlogForm createBlog={mockHandler} />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const createButton = screen.getByText('create')


    await user.type(titleInput, 'title test')
    await user.type(authorInput, 'author test')
    await user.type(urlInput, 'url test')

    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)

    expect(mockHandler.mock.calls[0][0].title).toBe('title test')
    expect(mockHandler.mock.calls[0][0].author).toBe('author test')
    expect(mockHandler.mock.calls[0][0].url).toBe('url test')

})