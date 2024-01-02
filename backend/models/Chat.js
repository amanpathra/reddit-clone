import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema({
    chatName: {
        type: String,
        trim: true,
        default: null
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: 'message',
        default: null
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},
{
    timestamps: true
})

const Chat = mongoose.model('chat', ChatSchema);
export default Chat;