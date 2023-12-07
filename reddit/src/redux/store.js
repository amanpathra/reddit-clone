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
        },
        conversation: {
            participant: null,
            chat: []
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
                            state.user.userData.votedPosts.push({vote: action.payload.set, id: action.payload.postId});
                            break;
                        case 1:
                            state.user.userData.votedPosts.filter(obj => obj.id !== action.payload.postId)
                            break;
                        case -1:
                            const foundPost = state.user.userData.votedPosts.find(obj => obj.id === action.payload.postId)
                            if(foundPost){
                                foundPost.vote = action.payload.set;
                            }
                            break;
                        default:
                            break;
                    }
                    break;

                case 'down':
                    switch (action.payload.isPostVoted) {
                        case 0:
                            state.user.userData.votedPosts.push({ vote: action.payload.set, id: action.payload.postId });
                            break;
                        case 1:
                            const foundPost = state.user.userData.votedPosts.find(obj => obj.id === action.payload.postId)
                            if (foundPost) {
                                foundPost.vote = action.payload.set;
                            }
                            break;
                        case -1:
                            state.user.userData.votedPosts.filter(obj => obj.id !== action.payload.postId)
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
            console.log(newFeedPosts);
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

                case 'PUSH_COMMENT':
                    state.focusedPost.comments.unshift(action.payload.comment)
                    break;

                case 'UPDATE_COMMENTS_VOTES':
                    switch (action.payload.vote){
                        case 'up':
                            switch (action.payload.isCommentVoted){
                                case 0:
                                    state.user.userData.votedComments.push({vote: action.payload.vote, id: action.payload.commentId});
                                    break;
                                case 1:
                                    state.user.userData.votedComments.filter(obj => obj.id !== action.payload.commentId)
                                    break;
                                case -1:
                                    const foundPost = state.user.userData.votedComments.find(obj => obj.id === action.payload.commentId)
                                    if (foundPost) {
                                        foundPost.vote = action.payload.vote;
                                    }
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'down':
                            switch (action.payload.isPostVoted) {
                                case 0:
                                    state.user.userData.votedComments.push({ vote: action.payload.vote, id: action.payload.commentId });
                                    break;
                                case 1:
                                    const foundPost = state.user.userData.votedComments.find(obj => obj.id === action.payload.commentId)
                                    if (foundPost) {
                                        foundPost.vote = action.payload.vote;
                                    }
                                    break;
                                case -1:
                                    state.user.userData.votedComments.filter(obj => obj.id !== action.payload.commentId)
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                break;
                default:
                    break;
            }
        },
        setConversation: (state, action) => {
            switch (action.payload.type) {
                case 'SEND_MSG':
                    state.conversation.chat.push({sender: 'YOU', text: action.payload.message})                    
                    break;

                case 'RECIEVE_MSG':
                    state.conversation.chat.push({sender: 'PARTICIPANT', text: action.payload.message})                    
                    break;
            
                default:
                    break;
            }
        }
    }
})

export const { setUser, setFeedPosts, updatePostVotes, setFocusedPost, setConversation } = appSlice.actions

export const store = configureStore({
    reducer: {
        app: appSlice.reducer
    }
});