import express from 'express';
import fetchuser from '../fetchuser.js';
import Chat from '../models/Chat.js';

const router = express.Router();

router.post('/create', fetchuser,

    async (req, res) => {
        try {
            // let success = false;
            const { participants } = req.body;
            let isGroupChat = req.body.participants.length > 1 ? true : false;

            const newChat = new Chat({
                chatName: isGroupChat ? `Group Chat (${participants.length})` : '',
                isGroupChat: isGroupChat,
                participants: [req.user.id, ...participants.map(participant => participant._id)],
                groupAdmin: isGroupChat ? req.user.id : null
            })
            const saveChat = await newChat.save();

            const sendChat = await Chat.findById(saveChat._id).populate({ path: 'participants', select: 'image username'});
            console.log('no no no 2')
            return res.json(sendChat);
        } catch(error){
            console.log(error);
            res.json({ErrorMessage: 'Internal Server Error'})
        }
    }
)

router.get('/user-chats', fetchuser,
    async (req, res) => {
        try {
            const userChats = await Chat.find({ participants: req.user.id }).populate({ path: 'participants', select: 'image username' }).populate({path: 'latestMessage'});
            res.json(userChats);
        } catch (error) {
            console.error('Error fetching user chats:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
)

export default router;