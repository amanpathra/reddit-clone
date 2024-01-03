import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User from '../models/User.js';
import fetchuser from '../fetchuser.js'
import Community from '../models/Community.js';
import Comment from '../models/Comment.js';

const router = express.Router();

router.post('/create',

    [body('community', 'Community name must be atleast 3 characters long.').isLength({ min: 3 }),
    body('title', 'Title must be alteast 5 characters long.').isLength({ min: 5 })],

    fetchuser,

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        try {
            const {community, title, text, flair} = req.body;

            const isCommunity = await Community.findOne({name: community});
            if (!isCommunity) return res.json({error: 'The choosen community does not exist.'})
            
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
        const notes = await Post.find({}).select('_id').sort({date: -1});
        return res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Internal server error');
    }
})

router.get('/fetchCommunityPosts/:communityName', async (req, res) => {
    try {
        // console.log('cimm')
        const notes = await Post.find({ community: req.params.communityName }).select('_id');
        return res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Internal server error');
    }
})

router.get('/:username/fetch/:tab', fetchuser, async (req, res) => {
    try {
        let posts;
        const userId = (await User.findOne({username: req.params.username}))._id;
        switch (req.params.tab) {
            case 'Posts':
                posts = await Post.find({user: userId}).select('_id').sort({date: -1});
                break;

            case 'Saved':
                posts = (await User.findById(userId).select('savedPosts').populate('savedPosts')).savedPosts;
                break;

            case 'Upvoted':
                posts = ((await User.findById(userId).select('votedPosts').populate('votedPosts._id')).votedPosts).filter(obj => obj.vote === 'up');
                break;

            case 'Downvoted':
                posts = ((await User.findById(userId).select('votedPosts').populate('votedPosts')).votedPosts).filter(obj => obj.vote === 'down');
                break;

            default:
                posts = [];
                break;
        }
        res.json({posts, isComments: false});
    } catch (error) {
        console.error('Error fetching posts: ', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/getPost/:postid', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postid);
        const user = await User.findById(post.user).select('username image');
        let postt = post.toObject();
        postt.username = user.username;
        postt.userimage = user.image;
        return res.json(postt);
    } catch (error) {
        console.log(error)
    }
})

router.put('/vote/:postid', fetchuser, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.postid, { $inc: { likes: req.body.creament } });
        if (req.body.vote === 'up'){
            switch (req.body.isPostVoted){
                case 0:
                    await User.findByIdAndUpdate(req.user.id, { $push: { votedPosts: {vote: req.body.vote, id: req.params.postid} } });
                    break;
                case 1:
                    await User.findByIdAndUpdate(req.user.id, { $pull: { votedPosts: { id: req.params.postid } } });
                    break;
                case -1:
                    await User.findByIdAndUpdate(req.user.id,
                        { $set: { 'votedPosts.$[elem].vote': req.body.vote } },
                        { arrayFilters: [{ 'elem.id': req.params.postid }] }
                    )
                    break;
            }
        } else if (req.body.vote === 'down'){
            switch (req.body.isPostVoted) {
                case 0:
                    await User.findByIdAndUpdate(req.user.id, { $push: { votedPosts: { vote: req.body.vote, id: req.params.postid } } });
                    break;
                case 1:
                    await User.findByIdAndUpdate(req.user.id,
                        { $set: { 'votedPosts.$[elem].vote': req.body.vote } },
                        { arrayFilters: [{ 'elem.id': req.params.postid }] }
                    )
                    break;
                case -1:
                    await User.findByIdAndUpdate(req.user.id, { $pull: { votedPosts: { id: req.params.postid } } });
                    break;
            }
        }
        return res.json(post);
    } catch (error) {
        console.log(error)
    }
})

export default router;