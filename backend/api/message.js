import express from 'express';
import fetchuser from '../fetchuser.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import UnreadMessage from '../models/UnreadMessage.js';
import {getIO} from '../socket.js';

const router = express.Router();

router.post('/create', fetchuser, async (req, res) => {
    try {
        const { chatId, content } = req.body;

        // Ensure the logged-in user is a participant in the specified chat
        const chat = await Chat.findOne({ _id: chatId, participants: req.user.id });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found or user is not a participant' });
        }

        // Create a new message
        const newMessage = await Message.create({
            chat: chatId,
            sender: req.user.id,
            content,
        });

        const updatedChat = await Chat.findByIdAndUpdate(chatId, {$set: {latestMessage: newMessage._id}}, {new: true});
        console.log(updatedChat);
        
        // getIO().on('connection', socket => {
        //     socket.broadcast.to(chatId).emit('chatMessage', newMessage);
        // })
        getIO().to(chatId).emit('recieve', newMessage);
        
        // Save unread message for each participant (except the sender)
        const participants = (await Chat.findById(chatId).select('participants')).participants;
        participants.forEach(participant => {
            if (participant !== req.user.id) {
                UnreadMessage.create({
                    reciever: participant,
                    chat: chatId,
                    message: newMessage._id,
                });
            }
        });
        
        res.json(newMessage);
        // return;
    } catch (error) {
        console.error('Error creating message:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/:chatId', fetchuser,
    async (req, res) => {
        try {
            const chat = await Message.find({chat: req.params.chatId});
            res.json(chat);
        } catch (error) {
            console.error('Error getting the chat: ', error.message);
            return res.status(500).json({error: 'Internal Server Error'})
        }
    }
)

export default router;