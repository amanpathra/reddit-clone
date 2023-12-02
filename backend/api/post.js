import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User from '../models/User.js';
import fetchuser from '../fetchuser.js'

const router = express.Router();

router.post('/submit',

    [body('community', 'Community name must be atleast 3 characters long.').isLength({ min: 3 }),
    body('title', 'Title must be alteast 5 characters long.').isLength({ min: 5 })],

    fetchuser,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        try {
            const {community, title, text, flair} = req.body;
            
            const post = new Post({
                community, title, text, flair, user: req.user.id
            })

            const savePost = await post.save();
            return res.json(savePost);
            
        } catch (error) {
            console.log(error)
        }
        
    }

);

router.get('/fetchAllPosts', async (req, res) => {
    try {
        const notes = await Post.find({}).select('_id');
        return res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Internal server error');
    }
})

router.get('/getPost', async (req, res) => {
    try {
        const post = await Post.findById(req.headers.id);
        const user = await User.findById(post.user).select('username');
        let postt = post.toObject();
        postt.username = user.username;
        return res.json(postt);
    } catch (error) {
        console.log(error)
    }
})

router.put('/vote', async (req, res) => {
    try {
        if (req.body.vote === 'up'){
            const post = await Post.findByIdAndUpdate(req.body.postId, { $inc: { likes: req.body.crement } }, { new: true });
            return res.json(post);
        } else if (req.body.vote === 'down'){
            const post = await Post.findByIdAndUpdate(req.body.postId, { $inc: { likes: req.body.crement } }, { new: true });
            return res.json(post);
        }
    } catch (error) {
        console.log(error)
    }
})

export default router;