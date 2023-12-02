import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../fetchuser.js';

const router = express.Router();

const JWT_SECRET = 'amanshhhh';

router.post('/signup',
    
    [body('email', 'Please enter a valid email.').isEmail(),
    body('username', 'Please choose a valid username.').isLength({min: 3}),
    body('password', 'Password must be atlease 6 characters long.').isLength({min: 6})],

    async (req, res)=>{
        let success = false;

        // If there are errors, return the request
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), success})
        }

        try {
            // Check if the a user with same email or username exist or not
            let user = await User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]})
            if(user){
                return res.status(400).json({error: 'Sorry, a user with this email or username already exist.', success})
            }
            
            const hashedPass = await bcrypt.hash(req.body.password, 10)

            user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPass
            })
            
            const data = {
                user: {
                    id: user.id
                }
            }
            
            success = true
            const authToken = jwt.sign(data, JWT_SECRET);
            return res.json({authToken, success});
            
        } catch (error) {
            console.log(error)
        }
    }
);


router.post('/login',

    [body('username', 'Please choose a valid username.').isLength({ min: 3 }),
    body('password', 'Password must be atlease 6 characters long.').isLength({ min: 6 })],

    async (req, res) => {
        let success = false;

        // If there are errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), success})
        }
        
        const {username, password} = req.body;
        try {
            const user = await User.findOne({username});
            if(!user){
                return res.status(400).json({error: 'Please try to login with correct credentials.', success})
            }
            
            const isMatched = await bcrypt.compare(password, user.password);
            if(!isMatched) return res.status(400).json({error: 'Please try to login with correct credentials.', success})
            
            const data = {
                user: {
                    id: user.id
                }
            }
            
            success = true;
            const authToken = jwt.sign(data, JWT_SECRET);
            return res.json({ authToken, success });

        } catch (error) {
            console.log(error)
        }
    }
    
)

router.get('/getUser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        return res.json(user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Internal server error');
    }
})

router.put('/updateUser', fetchuser, async (req, res) => {
    try {
        if (req.header("vote") === 'up'){
            console.log(req.header('isPostVoted'))
            if (req.header("isPostVoted") == 0){
                const user = await User.findByIdAndUpdate(req.user.id, { $push: { likedPosts: req.body.postId } }, { new: true });
                return res.json(user);
            } else if (req.header("isPostVoted") == 1){
                const user = await User.findByIdAndUpdate(req.user.id, { $pull: { likedPosts: req.body.postId } }, { new: true });
                return res.json(user);
            } else {
                const user = await User.findByIdAndUpdate(
                    req.user.id,
                    { 
                        $push: { likedPosts: req.body.postId },
                        $pull: { dislikedPosts: req.body.postId }
                    },
                    { new: true }
                )
                return res.json(user);
            }

        } else {
            if (req.header("isPostVoted") == 0) {
                const user = await User.findByIdAndUpdate(req.user.id, { $push: { dislikedPosts: req.body.postId } }, { new: true });
                return res.json(user);
            } else if (req.header("isPostVoted") == 1) {
                const user = await User.findByIdAndUpdate(
                    req.user.id,
                    {
                        $pull: { likedPosts: req.body.postId },
                        $push: { dislikedPosts: req.body.postId }
                    },
                    { new: true }
                )
                return res.json(user);
            } else {
                const user = await User.findByIdAndUpdate(req.user.id, { $pull: { dislikedPosts: req.body.postId } }, { new: true });
                return res.json(user);
            }
        }

    } catch (error) {
        console.log(error)
    }
})

export default router;