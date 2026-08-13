const { describe, test, after, before, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is initially some blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })


    test('note are returned as json', async () => {
        await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    })

    test('blog has id instade _id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })

    test('adding a new blog posts', async () => {

    const newBlog = {
        title: 'test',
        author: 'Mohammd',
        url: 'http://blog.cleancoder.com/test',
        likes: 1
    }

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogAtEnd.map(n => n.title)

    assert.ok(title.includes('test'))

    })


    test('default value is 0 for undfind likes', async () => {
        const newBlog = {
            title: 'مدونة بدون لايكات',
            author: 'Gaza Developer',
            url: 'https://safecode-lab.blogspot.com'
            // لاحظ: ما في likes هان
        }

        await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, 0)

    })

    test('cancel blog if title not provided', async () => {
        const newBlog = {
            author: 'Gaza Developer',
            url: 'https://safecode-lab.blogspot.com',
            likes: 4
        }

        await api.post('/api/blogs').send(newBlog).expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })


    test('cancel blog if url not provided', async () => {
        const newBlog = {
            title: 'test',
            author: 'Gaza Developer',
            likes: 4
        }

        await api.post('/api/blogs').send(newBlog).expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('delete a blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(n => n.title)
        assert.strictEqual(titles.includes(blogToDelete.title), false)
    })

    test('update a blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const newLikes = {
            likes: blogToUpdate.likes + 1
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newLikes)
            .expect(200)
        
        const updatedBlog = await helper.blogsInDb()
        const blog = updatedBlog.find(n => n.id === blogToUpdate.id)
        assert.strictEqual(response.body.likes, newLikes.likes)
        assert.strictEqual(blog.likes, newLikes.likes)
    })


})