import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        user: {
            token: null,
            userData: null
        },
        feedPosts: [],
        focusedPost: {
            id: null,
            comments: []
        }
    },
    reducers: {
        setUser: (state, action) => {
            switch (action.payload.set) {
                case 'token':
                    state.user.token = action.payload.token
                    break;

                case 'userData':
                    state.user.userData = action.payload.userData
                    break;

                case 'up':
                    switch (action.payload.isPostVoted) {
                        case 0:
                            state.user.userData.likedPosts.push(action.payload.postId);
                            break;
                        case 1:
                            state.user.userData.likedPosts.splice(state.user.userData.likedPosts.indexOf(action.payload.postId), 1)
                            break;
                        case -1:
                            state.user.userData.likedPosts.push(action.payload.postId);
                            state.user.userData.dislikedPosts.splice(state.user.userData.dislikedPosts.indexOf(action.payload.postId), 1)
                            break;
                        default:
                            break;
                    }
                    break;

                case 'down':
                    switch (action.payload.isPostVoted) {
                        case 0:
                            state.user.userData.dislikedPosts.push(action.payload.postId);
                            break;
                        case 1:
                            state.user.userData.dislikedPosts.push(action.payload.postId);
                            state.user.userData.likedPosts.splice(state.user.userData.likedPosts.indexOf(action.payload.postId), 1)
                            break;
                        case -1:
                            state.user.userData.dislikedPosts.splice(state.user.userData.dislikedPosts.indexOf(action.payload.postId), 1)
                            break;
                        default:
                            break;
                    }
                    break;
            
                default:
                    break;
            }
        },
        setFeedPosts: (state, action) => {
            if (action.payload === null){
                state.feedPosts = [];
                return;
            }
            state.feedPosts.unshift(action.payload.post);
        },
        updatePostVotes: (state, action) => {
            const newFeedPosts = state.feedPosts.filter(feedPost => feedPost._id !== action.payload.postId)
            state.feedPosts = newFeedPosts;
        },
        setFocusedPost: (state, action) => {
            switch (action.payload.type) {
                case 'SET_ID':
                    state.focusedPost.id = action.payload.id;
                    break;

                case 'SET_COMMENTS':
                    let arrayWithDups = state.focusedPost.comments.concat(action.payload.comments);
                    state.focusedPost.comments = Array.from(new Set(arrayWithDups.map(obj => obj._id))).map(id => {
                        return arrayWithDups.find(obj => (obj._id === id))
                    })
                    break;
                    
                case 'SET_REPLIES':
                    state.focusedPost.comments = state.focusedPost.comments.concat(action.payload.comments);
                    break;

                case 'PUSH_COMMENT':
                    state.focusedPost.comments.unshift(action.payload.comment)
                    break;
            
                default:
                    break;
            }
        }
    }
})

export const { setUser, setFeedPosts, updatePostVotes, setFocusedPost } = appSlice.actions

export const store = configureStore({
    reducer: {
        app: appSlice.reducer
    }
});