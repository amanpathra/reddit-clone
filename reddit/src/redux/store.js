import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        user: null,
        posts: []
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user
        },
        setPosts: (state, action) => {
            state.posts.unshift(action.payload.post)
        }
    }
})

export const { setUser, setPosts } = appSlice.actions

export const store = configureStore({
    reducer: {
        app: appSlice.reducer
    }
});