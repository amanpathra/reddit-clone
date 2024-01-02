import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://www.redditstatic.com/avatars/avatar_default_02_0079D3.png'
    },
    votedPosts: {
        type: Array,
        default: []
    },
    votedComments: {
        type: Array,
        default: []
    },
    savedPosts: {
        type: Array,
        default: []
    },
    myPosts: {
        type: Array,
        default: []
    },
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'chat'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', UserSchema);
export default User;