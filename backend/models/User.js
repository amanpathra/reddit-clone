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
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    },
    likedPosts: {
        type: Array,
        default: []
    },
    dislikedPosts: {
        type: Array,
        default: []
    }
})

const User = mongoose.model('user', UserSchema);
export default User;