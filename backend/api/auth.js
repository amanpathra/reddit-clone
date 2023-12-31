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

router.get('/getUserByUsername/:username', async (req, res) => {
    try{
        const user = await User.findOne({username: req.params.username});
        return res.json(user);
    } catch(error) {
        console.error('Error getting the user by username: ', error.message);
        return res.status(500).send('Internal Server Error.')
    }
})

router.get('/getUserSuggestions', async (req, res) => {
    try{
        const users = await User.find({ username: { $regex: new RegExp(req.headers.query, 'i') } }).select('username image');
        res.json({ users });
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;