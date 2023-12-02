import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setUser, updatePostVotes, setFocusedPost } from '../redux/store';


import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go'
import { LiaShareSolid } from 'react-icons/lia'
import { PiBookmarkSimpleFill } from 'react-icons/pi'

import userImg from '../assets/user.png'
import '../styles/FeedPost.css'

const FeedPost = ({ postId, alone }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isPostVoted, setIsPostVoted] = useState(0);

    const { user } = useSelector(state => state.app);

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:5000/api/post/getPost', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "id": postId
                }
            })
            const restData = await res.json();
            setPost(restData);

            setIsPostVoted(user.userData?.likedPosts.includes(postId) ? 1 : user.userData?.dislikedPosts.includes(postId) ? -1 : 0);
        })();
    }, [postId, user])

    const handleVote = async (vote) => {
        let crement;
        switch (vote) {
            case 'up':
                crement = isPostVoted === -1 ? 2 : isPostVoted === 0 ? 1 : -1;

                dispatch(updatePostVotes({ crement, postId }));
                dispatch(setUser({ set: vote, postId, isPostVoted }))
                setPost({ ...post, likes: post.likes + crement });

                await fetch('http://localhost:5000/api/post/vote', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ postId, crement, vote })
                })

                await fetch(`http://localhost:5000/api/auth/updateUser`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": user.token,
                        "isPostVoted": isPostVoted,
                        "vote": vote
                    },
                    body: JSON.stringify({ postId })
                })
                setIsPostVoted(crement === -1 ? 0 : 1)
                break;

            case 'down':
                crement = isPostVoted === -1 ? 1 : isPostVoted === 0 ? -1 : -2;

                dispatch(updatePostVotes({ crement, postId }))
                dispatch(setUser({ set: vote, postId, isPostVoted }))
                setPost({ ...post, likes: post.likes + crement })

                await fetch('http://localhost:5000/api/post/vote', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ postId, crement, vote })
                })

                await fetch(`http://localhost:5000/api/auth/updateUser`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": user.token,
                        "isPostVoted": isPostVoted,
                        "vote": vote
                    },
                    body: JSON.stringify({ postId })
                })

                setIsPostVoted(crement === 1 ? 0 : -1)
                break;

            default:
                break;
        }
    }

    const handlePostClick = () => {
        dispatch(setFocusedPost({type: 'SET_ID', id: postId}))
        navigate(`/post/${postId}`)
    }

    return (
        <div className={`feed-post${!alone?' round-corner':''}`} onClick={handlePostClick}>
            <div className="feed-post-votes">
                <BiSolidUpvote
                    size={24}
                    style={{ color: isPostVoted === 1 ? '#ff4500' : '#d0d0d0' }}
                    onClick={(e) => { e.stopPropagation(); handleVote('up') }}
                />
                <span>{post?.likes}</span>
                <BiSolidDownvote
                    size={24}
                    style={{ color: isPostVoted === -1 ? '#7193ff' : '#d0d0d0' }}
                    onClick={(e) => { e.stopPropagation(); handleVote('down') }}
                />
            </div>
            <div className="feed-post-main">
                <div className="feed-post-head">
                    <img src={userImg} alt="" height={20} />
                    <span className='feed-post-head-subreddit'>r/{post?.community}</span>
                    <span className='feed-post-head-user'>Posted by u/{post?.username} 9 hours ago</span>
                </div>
                <div className="feed-post-content">
                    <h4>{post?.title}</h4>
                    {post?.flair && <span>{post?.flair}</span>}
                    <p>{post?.text}</p>
                </div>
                <div className="feed-post-btns">
                    <div className="feed-post-btn">
                        <GoComment size={22} />
                        <span>{post?.comments?.length} comments</span>
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