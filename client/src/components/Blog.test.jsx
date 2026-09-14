import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import useBlogStore from '../store/blogStore'

const { userState } = vi.hoisted(() => ({ userState: { current: null } }))

vi.mock('../store/userStore', () => ({
  useUser: () => userState.current,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: 'blog1' }),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('../services/blogs', () => ({
  default: {
    update: vi
      .fn()
      .mockImplementation((_id, updatedBlog) => Promise.resolve(updatedBlog)),
    remove: vi.fn().mockResolvedValue({}),
    setToken: vi.fn(),
  },
}))

describe('<Blog /> Single Blog View Tests', () => {
  let blog

  beforeEach(() => {
    blog = {
      id: 'blog1',
      title: 'Testing React Apps Made Easy',
      author: 'Full Stack Developer',
      url: 'https://fullstackopen.com',
      likes: 42,
      user: {
        id: 'user1',
        name: 'Gaza Developer',
      },
    }

    useBlogStore.setState({ blogs: [blog] })
    userState.current = null
    vi.clearAllMocks()
  })

  // Test 1: Unauthenticated users
  test('Unauthenticated users see blog info and likes but no buttons', async () => {
    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    )

    // Should see title and author
    expect(screen.getByText(/Testing React Apps Made Easy/i)).toBeDefined()
    expect(screen.getByText(/Full Stack Developer/i)).toBeDefined()

    expect(screen.getByText(/42/)).toBeDefined()

    // Should NOT see any action buttons (like, remove)
    expect(screen.queryByRole('button', { name: /like/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
  })

  // Test 2: Authenticated user who is NOT the blog creator
  test('Authenticated non-creator users see only the like button', async () => {
    const user = {
      id: 'user2', // Different from blog creator
      name: 'Another User',
    }
    userState.current = user

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    )

    // Should see blog title
    expect(screen.getByText(/Testing React Apps Made Easy/i)).toBeDefined()

    expect(screen.getByText(/42/)).toBeDefined()

    // Should see like button
    expect(screen.getByRole('button', { name: /like/i })).toBeDefined()

    // Should NOT see remove button
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
  })

  // Test 3: Blog creator (authenticated)
  test('Blog creator sees both like and delete buttons', async () => {
    const user = {
      id: 'user1', // Same as blog creator
      name: 'Gaza Developer',
    }
    userState.current = user

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    )

    // Should see blog title
    expect(screen.getByText(/Testing React Apps Made Easy/i)).toBeDefined()

    // Should see both buttons
    expect(screen.getByRole('button', { name: /like/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /remove/i })).toBeDefined()
  })

  // Test 4: Like button functionality for authenticated user
  test('Like button updates likes for authenticated user', async () => {
    const user = {
      id: 'user2',
      name: 'Another User',
    }
    userState.current = user

    const setupUser = userEvent.setup()

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    )

    // Click like button
    const likeButton = screen.getByRole('button', { name: /like/i })
    await setupUser.click(likeButton)

    // Verify setBlogs was called
    expect(useBlogStore.getState().blogs[0].likes).toBe(43)
  })

  // Test 5: Delete button functionality for blog creator
  test('Delete button removes blog for creator', async () => {
    const user = {
      id: 'user1', // Creator
      name: 'Gaza Developer',
    }
    userState.current = user

    const setupUser = userEvent.setup()

    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    )

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /remove/i })
    await setupUser.click(deleteButton)

    expect(useBlogStore.getState().blogs).toHaveLength(0)
  })
})
