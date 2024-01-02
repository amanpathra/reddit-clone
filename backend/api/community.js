import express from 'express';
// import { body, validationResult } from 'express-validator';
// import Post from '../models/Post.js';
// import User from '../models/User.js';
import fetchuser from '../fetchuser.js';
import Community from '../models/Community.js';

const router = express.Router();

router.post('/create', fetchuser,
    async (req, res) => {
        try {
            let success = false;
            const {name, frontline, about, icon} = req.body;

            if (/[^A-Za-z0-9_]/.test(name)) return res.json({success, error: 'Community name cannot contain special characters except underscore (_).'});

            let community = await Community.findOne({name});
            if (community) return res.json({success, error: 'Community with this name already exist.'});


            community = await Community.create({
                name,
                frontline,
                about,
                icon,
                members: 0,
                mods: [req.user.id]
            })

            success = true;

            res.json({success, community})
            
        } catch (error) {
            console.error('Error creating community: ', error.message);
            res.json({error: 'Internal Server Error'});
        }
    }
)

router.get('/:community', async (req, res) => {
    const community = await Community.findOne({name: req.params.community});
    res.json(community);
})

export default router;