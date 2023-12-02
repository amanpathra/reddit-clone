import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    markdown: {
        type: Boolean,
        default: true
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    replies: {
        type: Array,
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
        default: undefined
    }
})

const Comment = mongoose.model('comment', CommentSchema);
export default Comment;