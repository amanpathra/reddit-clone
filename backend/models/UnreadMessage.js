import mongoose, { Schema } from "mongoose";

const UnreadMessageSchema = new Schema({
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat', required: true
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', required: true
    },
},
    {
        timestamps: true
    })

const UnreadMessage = mongoose.model('unreadMessage', UnreadMessageSchema);
export default UnreadMessage;