import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {marked} from 'marked';

import { LiaReplySolid } from 'react-icons/lia';
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';

import CommentBox from './CommentBox';
import { setFocusedPost } from '../redux/store';

import '../styles/Comment.css'

const Comment = ({ commentData }) => {

    const dispatch = useDispatch();

    const { user, focusedPost } = useSelector(state => state.app);
    const replies = focusedPost?.comments.filter(cmnt => cmnt.parent === commentData._id);

    const [replyBox, setReplyBox] = useState(false);
    const [isCommentVoted, setIsCommentVoted] = useState(user?.userData?.votedComments.find(obj => obj.id === commentData._id) ? (user?.userData?.votedComments.find(obj => obj.id === commentData._id).vote === 'up' ? 1 : -1) : 0);
    const [commentsLikes, setCommentsLikes] = useState(commentData.likes);


    useEffect(() =>{
        (async () =>{
            if (commentData.replies.length){
                const res = await fetch('http://localhost:5000/api/comment/getReplies', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'commentid': commentData._id
                    }
                })
                const resData = await res.json();
                // console.log(resData)
                dispatch(setFocusedPost({type: 'SET_COMMENTS', comments: resData}));
            }
        })();
    }, [commentData._id, dispatch, commentData.replies.length])

    const voteWork = async (vote, isCommentVoted, creament) => {
        dispatch(setFocusedPost({ type: 'UPDATE_COMMENTS_VOTES', vote, commentId: commentData._id, isCommentVoted }))
        setCommentsLikes(state => state + creament)

        await fetch(`http://localhost:5000/api/comment/vote/${commentData._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "auth-token": user.token
            },
            body: JSON.stringify({ isCommentVoted, creament, vote })
        })
    }

    const handleVote = async (vote) => {
        let creament;
        switch (vote) {
            case 'up':
                creament = isCommentVoted === -1 ? 2 : isCommentVoted === 0 ? 1 : -1;
                await voteWork(vote, isCommentVoted, creament);
                setIsCommentVoted(creament === -1 ? 0 : 1);
                break;

            case 'down':
                creament = isCommentVoted === -1 ? 1 : isCommentVoted === 0 ? -1 : -2;
                await voteWork(vote, isCommentVoted, creament);
                setIsCommentVoted(creament === 1 ? 0 : -1);
                break;

            default:
                break;
        }
    }

    return (
        <div className='comment comment-main'>
            <div className="comment-user-profile">
                <img className='comment-user-profile-picture' src={commentData?.userimage} alt="" />
                <span>{commentData?.anonymous ? '[anonymous user]' : commentData?.username}</span>
            </div>
            <div className="comment-content" dangerouslySetInnerHTML={{ __html: commentData?.markdown ? marked(commentData?.text) : commentData?.text }}/>
            <div className="comment-interactions">
                <BiSolidUpvote
                    size={20}
                    style={{ color: isCommentVoted === 1 ? '#ff4500' : '#d0d0d0' }}
                    onClick={(e) => { e.stopPropagation(); handleVote('up') }}
                />
                <span>{commentsLikes}</span>
                <BiSolidDownvote
                    size={20}
                    style={{ color: isCommentVoted === -1 ? '#7193ff' : '#d0d0d0' }}
                    onClick={(e) => { e.stopPropagation(); handleVote('down') }}
                />
                <div className="comment-interactions-share">
                    <LiaReplySolid size={16} />
                    <button onClick={() => setReplyBox(state => !state)}>Reply</button>
                </div>
            </div>
            {replyBox && <CommentBox commentId={commentData._id} key={commentData._id}/>}
            {replies?.map(reply => (
                <Comment commentData={reply} key={reply._id}/>
            ))}
        </div>
    )
}

export default Comment;