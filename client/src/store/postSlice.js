import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    posts: [],
    selectedPost: null
}

const postSlice = createSlice({
    name: 'posts',
    initialState,

    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload)
        },
        updatePost: (state, action) => {
            const { slug, newContent } = action.payload
            const index = state.posts.findIndex(post => post.slug === slug)
            if (index !== -1)
                state.posts[index] = newContent
        },
        deletePost: (state, action) => {
            if (!action.payload) return
            state.posts = state.posts.filter(post =>
                post._id !== action.payload
            )
        }
    }
})

export const { setPosts, updatePost, deletePost, addPost } = postSlice.actions
export default postSlice.reducer



