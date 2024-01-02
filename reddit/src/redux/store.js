import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
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
            switch (action.payload.type){
                case 'SET_POSTS':
                    state.feedPosts = action.payload.posts;
                    break;

                case 'PUSH_POST':
                    state.feedPosts.unshift(action.payload.post);
                    break;
                
                default:
                    break;
            }
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
        }
    }
})

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
        conversation: {
            participants: [],
            chat: []
        }
    },
    reducers: {
        setChats: (state, action) => {
            switch(action.payload.type){
                case 'ADD_NEW_CHAT':
                    state.chats.push(action.payload.chat);
                    break;
                    
                case 'SET_FETCHED_CHATS':
                    state.chats = action.payload.chats;
                    break;

                case 'SET_LATEST_MSG':
                    const index = state.chats.findIndex(chatObj => chatObj._id === action.payload.message.chat);
                    if (index !== -1) {
                        state.chats[index].latestMessage = action.payload.message;
                    }
                    break;
            }
        },
        setConversation: (state, action) => {
            switch (action.payload.type) {
                case 'SEND':
                    state.conversation.chat.push({ sender: 'YOU', text: action.payload.message });
                    break;

                case 'RECIEVE':
                    state.conversation.chat.push({ sender: 'PARTICIPANT', text: action.payload.message });
                    break;

                case 'LEFT_CHAT':
                    state.conversation.chat.push({ sender: 'SERVER', text: `${action.payload.name} left the chat` });
                    break;

                case 'JOINED_CHAT':
                    state.conversation.chat.push({ sender: 'SERVER', text: `${action.payload.name} joined the chat` });
                    break;

                case 'SET_CHAT':
                    state.conversation.chat = action.payload.chat;
                    state.conversation.participants = action.payload.selectedChat.participants;
                    break;

                default:
                    break;
            }
        }
    }
})

const communitySlice = createSlice({
    name: 'community',
    initialState: {
        community: {}
    },
    reducers: {
        setCommunity: (state, action) => {
            switch (action.payload.type){
                case 'SET_COMMUNITY':
                    state.community = action.payload.community;
                    break;
            }
        }
    }
})

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profileUser: {}
    },
    reducers: {
        setProfileUser: (state, action) => {
            switch (action.payload.type) {
                case 'SET_USER':
                    state.profileUser = action.payload.user;
                    break;
            }
        }
    }
})

export const { setUser, setFeedPosts, updatePostVotes, setFocusedPost } = userSlice.actions
export const { setConversation, setChats } = chatSlice.actions
export const { setCommunity } = communitySlice.actions;
export const { setProfileUser } = profileSlice.actions;

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        chat: chatSlice.reducer,
        community: communitySlice.reducer,
        profile: profileSlice.reducer
    }
});