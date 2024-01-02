import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    }
},
{
    timestamps: true
})

const Message = mongoose.model('message', MessageSchema);
export default Message;