import React, { useDebugValue, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { GrExpand } from "react-icons/gr";
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go';
import { LiaShareSolid } from 'react-icons/lia';
import { PiBookmarkSimpleFill } from 'react-icons/pi';
import getTimeByDate from '../middlewares/getTimeByDate';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/store';
import '../styles/PostShort.css'

const PostShort = ({postId}) => {

    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [post, setPost] = useState(null);
    const [isPostVoted, setIsPostVoted] = useState(user?.userData?.votedPosts.find(obj => obj.id === postId) ? (user?.userData?.votedPosts.find(obj => obj.id === postId).vote === 'up' ? 1 : -1) : 0);

    useEffect(() => {
        console.log(postId);
        (async () => {
            const res = await fetch(`http://192.168.29.205:5000/api/post/getPost/${postId}`);
            const restData = await res.json();
            // console.log(restData);
            setPost(restData);
        })();
    }, [postId])

    const voteWork = async (vote, isPostVoted, creament) => {
        dispatch(setUser({ set: vote, postId, isPostVoted }));
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

    return (
        <div className='PostShort'>
            <div className="post-short-votes">
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
            <div className="post-short-rest">
                <h5 className='post-short-title'>{post?.title}</h5>
                <div className='community-and-user'>
                    <span className='community'>r/{post?.community}</span>
                    <button>Join</button>
                    <span className='post-short-user'>Posted by <Link to={`/u/${post?.username}`}>u/{post?.username}</Link> {getTimeByDate(post?.date)}</span>
                </div>
                <div className='action-buttons'>
                    <div className="post-short-btn">
                        <GrExpand/>
                        <span>Expand</span>
                    </div>
                    <div className="post-short-btn">
                        <GoComment size={22} />
                        <span>{post?.comments?.length} comments</span>
                    </div>
                    <div className="post-short-btn">
                        <LiaShareSolid size={22} />
                        <span>Share</span>
                    </div>
                    <div className="post-short-btn">
                        <PiBookmarkSimpleFill size={22} />
                        <span>Save</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostShort;