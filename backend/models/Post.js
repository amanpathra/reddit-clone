import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    community: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    flair: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    comments:{
        type: Array,
        default: []
    }
})

const Post = mongoose.model('post', PostSchema);
export default Post;