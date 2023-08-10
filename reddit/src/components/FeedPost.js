import React, { useEffect, useState } from 'react';
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go'
import { LiaShareSolid } from 'react-icons/lia'
import { PiBookmarkSimpleFill } from 'react-icons/pi'

import userImg from '../assets/user.png'
import '../styles/FeedPost.css'

const FeedPost = ({ post, idx }) => {

    const [username, setUsername] = useState('');

    (async () => {
        const res = await fetch(`http://localhost:5000/api/auth/getUser/${post.user}`)
        const data = await res.json();
        setUsername(data.username)
        return data
    })();
    
    return (
        <div className="feed-post">
            <div className="feed-post-votes">
                <BiSolidUpvote size={24} />
                <span>{post.likes}</span>
                <BiSolidDownvote size={24} />
            </div>
            <div className="feed-post-main">
                <div className="feed-post-head">
                    <img src={userImg} alt="" height={20} />
                    <span className='feed-post-head-subreddit'>r/{post.community}</span>
                    <span className='feed-post-head-user'>Posted by u/{username} 9 hours ago</span>
                </div>
                <div className="feed-post-content">
                    <h4>{post.title}</h4>
                    <span>{post.flair}</span>
                    <p>{post.text}</p>
                </div>
                <div className="feed-post-btns">
                    <div className="feed-post-btn">
                        <GoComment size={22} />
                        <span>{post.comments.length} comments</span>
                    </div>
                    <div className="feed-post-btn">
                        <LiaShareSolid size={22} />
                        <span>Share</span>
                    </div>
                    <div className="feed-post-btn">
                        <PiBookmarkSimpleFill size={22} />
                        <span>Save</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedPost;