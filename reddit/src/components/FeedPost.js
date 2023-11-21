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
    const [isPostVoted, setIsPostVoted] = useState(0);

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
            setIsPostVoted(userLikedPosts?.likedPosts.includes(post._id) ? 1 : userLikedPosts?.dislikedPosts.includes(post._id) ? -1 : 0);
        })();
    }, [userLikedPosts, post._id, post.user, user])


    const handleVote = async (vote) => {
        let crement;
        switch (vote) {
            case 'up':
                crement = isPostVoted === -1 ? 2 : isPostVoted === 0 ? 1 : -1;
                
                await fetch('http://localhost:5000/api/post/vote', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({postId: post._id, crement, vote})
                })

                setPostLikes((prevPostLikes) => prevPostLikes + crement);
                
                await fetch(`http://localhost:5000/api/auth/updateUser`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": user,
                        "isPostVoted": isPostVoted,
                        "vote": vote
                    },
                    body: JSON.stringify({ postId: post._id })
                })
                setIsPostVoted(crement === -1 ? 0 : 1)
                break;

            case 'down':
                crement = isPostVoted === -1 ? 1 : isPostVoted === 0 ? -1 : -2;

                await fetch('http://localhost:5000/api/post/vote', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({postId: post._id, crement, vote})
                })

                setPostLikes((prevPostLikes) => prevPostLikes + crement);
                
                await fetch(`http://localhost:5000/api/auth/updateUser`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": user,
                        "isPostVoted": isPostVoted,
                        "vote": vote
                    },
                    body: JSON.stringify({ postId: post._id })
                })

                setIsPostVoted(crement === 1 ? 0 : -1)
                break;

            default:
                break;
        }
    }
    
    return (
        <div className="feed-post">
            <div className="feed-post-votes">
                <BiSolidUpvote
                    size={24}
                    style={{ color: isPostVoted === 1 ? '#ff4500' : '#d0d0d0' }}
                    onClick={() => handleVote('up')}
                />
                <span>{postLikes}</span>
                <BiSolidDownvote
                    size={24}
                    style={{ color: isPostVoted === -1 ? '#7193ff' : '#d0d0d0' }}
                    onClick={() => handleVote('down')}
                />
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