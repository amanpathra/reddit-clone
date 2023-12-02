import express from 'express';
import { body, validationResult } from 'express-validator';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import fetchuser from '../fetchuser.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/submit',

    [body('comment.text', 'Comment must be atleast two characters long.').isLength({min: 2})],

    fetchuser,

    async (req, res) => {

        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        try {
            
            const newComment = new Comment({
                ...req.body.comment,
                user: req.user.id,
                post: req.headers.postid,
                parent: req.body.commentId
            })
            
            const saveComment = await newComment.save();
            console.log(saveComment)
            
            await Post.findByIdAndUpdate(req.headers.postid, { $push: { comments: saveComment._id }})
            
            if (req.body.commentId) await Comment.findByIdAndUpdate(req.body.commentId, {$push: {replies: saveComment._id}});

            const user = await User.findById(saveComment.user).select('username');
            let saveCommentt = saveComment.toObject();
            saveCommentt.username = user.username;

            return res.json(saveCommentt);

        } catch (error) {
            console.log(error)
        }
    }
)

router.get('/getPostComments', async (req, res) => {
    try {
        const comments = await Comment.find({ parent: req.headers.postid });
        
        const cmnts = await Promise.all(comments.map(async cmnt => {
            const user = await User.findById(cmnt.user).select('username');
            let cmntt = cmnt.toObject();
            cmntt.username = user.username;
            return cmntt;
        }))
        return res.json(cmnts);
    } catch (error) {
        console.log(error, 'l')
    }
})

router.get('/getReplies', async (req, res) => {
    try {
        const replies = await Comment.find({ parent: req.headers.commentid });

        const rpls = await Promise.all(replies.map(async rpl => {
            const user = await User.findById(rpl.user).select('username');
            let rpll = rpl.toObject();
            rpll.username = user.username;
            return rpll;
        }))
        // console.log(rpls)
        return res.json(rpls);

    } catch (error) {
        console.log(error);
    }

})

export default router;