import { create } from "zustand";

import blogService from '../services/blogs'

const useBlogStore = create((set,get) => ({
    blogs : [],
    notification:'',
    actions:{
        addBlog: async (newObject) =>{
            const newBlog = await blogService.create(newObject)
            set((state)=>({blogs : state.blogs.concat(newBlog)}))
            get().actions.setNotification(`you add '${newObject.title}'`, 3)
        },
        setNotification: (message, timeInSeconds = 3) => {
            set({ notification: message })
            setTimeout(() => {
                set({ notification: '' })
            }, timeInSeconds * 1000)
        },    
        initialize: async () => {
            const blogs = await blogService.getAll()
            set(()=> ({ blogs }))
        },
        addLikes: async (id) =>{
            const blog = get().blogs.find(b => b && (b.id || b._id) === id)
            if (!blog) return

            const updated = await blogService.update(
                id, {...blog,likes: blog.likes + 1 }
            )
            set(state => ({
                blogs: state.blogs.map(blog =>
                    blog && (blog.id || blog._id) === id ? updated : blog
                )
            }))
        },
        deleteBlog: async (id) =>{
            const blog = get().blogs.find(b => b && (b.id || b._id) === id)
            if (!blog) return

            await blogService.remove(id)

            set(state => ({
                blogs: state.blogs.filter(a => a && (a.id || a._id) !== id)
            }))
            get().actions.setNotification(`you removed '${blog.title}'`, 3)
        }
    }
}))


export default useBlogStore

export const useBlogs = () => useBlogStore(state => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
export const useNotification = () => useBlogStore((state) => state.notification)
