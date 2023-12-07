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
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        try {
            
            const newComment = new Comment({
                ...req.body.comment,
                user: req.user.id,
                post: req.headers.postid,
                parent: req.body.commentId
            })

            if (req.body.comment.anonymous) {console.log('workn'); delete newComment.user};
            console.log(newComment);
            
            const saveComment = await newComment.save();
            
            await Post.findByIdAndUpdate(req.headers.postid, { $push: { comments: saveComment._id }});
            
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
            const user = await User.findById(cmnt.user).select('username image');
            let cmntt = cmnt.toObject();
            cmntt.username = user.username;
            cmntt.userimage = user.image;
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
            const user = await User.findById(rpl.user).select('username image');
            let rpll = rpl.toObject();
            rpll.username = user.username;
            rpll.userimage = user.image;
            return rpll;
        }))
        // console.log(rpls)
        return res.json(rpls);

    } catch (error) {
        console.log(error);
    }

})

router.put('/vote/:commentid', fetchuser, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentid, { $inc: { likes: req.body.creament } });
        if (req.body.vote === 'up') {
            switch (req.body.isCommentVoted) {
                case 0:
                    await User.findByIdAndUpdate(req.user.id, { $push: { votedComments: { vote: req.body.vote, id: req.params.commentid } } }, {new: true});
                    break;
                case 1:
                    await User.findByIdAndUpdate(req.user.id, { $pull: { votedComments: { id: req.params.commentid } } });
                    break;
                case -1:
                    await User.findByIdAndUpdate(req.user.id,
                        { $set: { 'votedComments.$[elem].vote': req.body.vote } },
                        { arrayFilters: [{ 'elem.id': req.params.commentid }] }
                    )
                    break;
            }
        } else if (req.body.vote === 'down') {
            switch (req.body.isCommentVoted) {
                case 0:
                    await User.findByIdAndUpdate(req.user.id, { $push: { votedComments: { vote: req.body.vote, id: req.params.commentid } } });
                    break;
                case 1:
                    await User.findByIdAndUpdate(req.user.id,
                        { $set: { 'votedComments.$[elem].vote': req.body.vote } },
                        { arrayFilters: [{ 'elem.id': req.params.commentid }] }
                    )
                    break;
                case -1:
                    await User.findByIdAndUpdate(req.user.id, { $pull: { votedComments: { id: req.params.commentid } } });
                    break;
            }
        }
        return res.json(comment);
    } catch (error) {
        console.log(error)
    }
})

export default router;