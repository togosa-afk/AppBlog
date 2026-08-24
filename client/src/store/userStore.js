import { create } from "zustand";
import userService from '../services/persistentUser'
import { useBlogs } from './blogStore'

import loginService from '../services/login'


const useLoginUserStore = create((set, get) => ({
    user: null,
    initialized: false,
    actions: {
        login: async (credentials) => {
            const user = await loginService.login(credentials)
            userService.saveUser(user)
            set({ user })
            return user
        },
        logout: () => {
            userService.removeUser()
            set({ user: null })
        },
        initUser: () => {
            set({ user: userService.getUser() ,initialized: true })
        }
    }
}))

export default useLoginUserStore
export const useUser = () => useLoginUserStore(state => state.user)
export const useUserInitialized = () => useLoginUserStore(state => state.initialized)
export const useActions = () => useLoginUserStore(state => state.actions)

export const useUsers = () => {
    const blogs = useBlogs()

    return Object.values(blogs.reduce((usersById, blog) => {
        const userId = blog.user?.id || blog.user?.userName || blog.author
        const existingUser = usersById[userId]

        usersById[userId] = existingUser
            ? { ...existingUser, blogsCount: existingUser.blogsCount + 1 }
            : {
                id: blog.user?.id || blog.user?._id,
                name: blog.user?.name || blog.author,
                userName: blog.user?.userName || blog.author,
                blogsCount: 1
            }

        return usersById
    }, {}))
}