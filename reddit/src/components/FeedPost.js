import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { setUser, setFocusedPost } from '../redux/store';


import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go'
import { LiaShareSolid } from 'react-icons/lia'
import { PiBookmarkSimpleFill } from 'react-icons/pi'

// import userImg from '../assets/user.png';
import getTimeByDate from '../middlewares/getTimeByDate';
import '../styles/FeedPost.css'

const FeedPost = ({ postId, alone, communityPost }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.user);

    const [post, setPost] = useState(null);
    const [isPostVoted, setIsPostVoted] = useState(user?.userData?.votedPosts.find(obj => obj.id === postId) ? (user?.userData?.votedPosts.find(obj => obj.id === postId).vote === 'up' ? 1 : -1) : 0);

    useEffect(() => {
        (async () => {
            const res = await fetch(`http://192.168.29.205:5000/api/post/getPost/${postId}`);
            const restData = await res.json();
            setPost(restData);
        })();
    }, [postId, user])

    const voteWork = async (vote, isPostVoted, creament) => {
        dispatch(setUser({ set: vote, postId, isPostVoted }))
        setPost({ ...post, likes: post.likes + creament });

        await fetch(`http://192.168.29.205:5000/api/post/vote/${postId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "auth-token": user.token,
            },
            body: JSON.stringify({ isPostVoted, creament, vote })
        })
    }

    const handleVote = async (vote) => {
        let creament;
        switch (vote) {
            case 'up':
                creament = isPostVoted === -1 ? 2 : isPostVoted === 0 ? 1 : -1;
                await voteWork(vote, isPostVoted, creament);
                setIsPostVoted(creament === -1 ? 0 : 1);
                break;

            case 'down':
                creament = isPostVoted === -1 ? 1 : isPostVoted === 0 ? -1 : -2;
                await voteWork(vote, isPostVoted, creament);
                setIsPostVoted(creament === 1 ? 0 : -1);
                break;

            default:
                break;
        }
    }

    const handlePostClick = () => {
        dispatch(setFocusedPost({ type: 'SET_ID', id: postId }))
        navigate(`/post/${postId}`)
    }

    return (
        <div className={`feed-post${!alone ? ' round-corner' : ''}`}>
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
                    {!communityPost && (
                        <>
                            <img src={post?.userimage} alt="" height={20} />
                            <Link to={`/r/${post?.community}`} className='feed-post-head-subreddit'>r/{post?.community}</Link>
                        </>
                    )}
                    <span className='feed-post-head-user'>Posted by <Link to={`/u/${post?.username}`}>u/{post?.username}</Link> {getTimeByDate(post?.date)}</span>
                </div>
                <div className="feed-post-content" onClick={handlePostClick}>
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