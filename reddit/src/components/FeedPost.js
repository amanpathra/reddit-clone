import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go'
import { LiaShareSolid } from 'react-icons/lia'
import { PiBookmarkSimpleFill } from 'react-icons/pi'

import userImg from '../assets/user.png'
import '../styles/FeedPost.css'

const FeedPost = ({ post, idx, userLikedPosts }) => {

    const [username, setUsername] = useState('');
    const [postLikes, setPostLikes] = useState(post.likes);
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [isPostDisliked, setIsPostDisliked] = useState(false);

    const { user } = useSelector(state => state.app);

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:5000/api/auth/getUser', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": user,
                    "id": post.user,
                    "get": 'userWhoPosted'
                }
            })
            const data = await res.json();
            setUsername(data.username);

            setIsPostLiked(userLikedPosts?.likedPosts.includes(post._id));
            setIsPostDisliked(userLikedPosts?.dislikedPosts.includes(post._id));
        })();
    }, [userLikedPosts])


    const handleVote = async (vote) => {
        switch (vote) {
            case 'up':
                let increment = isPostLiked ? -1 : 1;
                const postt = await fetch('http://localhost:5000/api/post/vote', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({postId: post._id, increment, vote})
                })

                setPostLikes(isPostLiked ? (postLikes - 1) : (postLikes + 1));

                const res = await fetch(`http://localhost:5000/api/auth/updateUser`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": user,
                        "isPostLiked": isPostLiked,
                        "vote": vote
                    },
                    body: JSON.stringify({ postId: post._id })
                })

                setIsPostLiked(isPostLiked ? false : true)
                break;

            case 'down':
                let decrement = isPostDisliked ? 1 : -1;
                const posttt = await fetch('http://localhost:5000/api/post/vote', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({postId: post._id, decrement, vote})
                })

                setPostLikes(isPostDisliked ? (postLikes + 1) : (postLikes - 1));

                const ress = await fetch(`http://localhost:5000/api/auth/updateUser`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": user,
                        "isPostDisliked": isPostDisliked,
                        "vote": vote
                    },
                    body: JSON.stringify({ postId: post._id })
                })

                setIsPostDisliked(isPostDisliked ? false : true)
                break;
        
            default:
                break;
        }
    }
    
    return (
        <div className="feed-post">
            <div className="feed-post-votes">
                <BiSolidUpvote size={24} style={{ color: isPostLiked?'#ff4500':'#d0d0d0' }} onClick={() => handleVote('up')}/>
                <span>{postLikes}</span>
                <BiSolidDownvote size={24} style={{ color: isPostDisliked ? '#7193ff' : '#d0d0d0' }} onClick={() => handleVote('down')}/>
            </div>
            <div className="feed-post-main">
                <div className="feed-post-head">
                    <img src={userImg} alt="" height={20} />
                    <span className='feed-post-head-subreddit'>r/{post.community}</span>
                    <span className='feed-post-head-user'>Posted by u/{username} 9 hours ago</span>
                </div>
                <div className="feed-post-content">
                    <h4>{post.title}</h4>
                    {post.flair && <span>{post.flair}</span>}
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