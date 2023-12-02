import React, { useEffect, useState } from 'react'
import '../styles/Comment.css'
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { LiaReplySolid } from 'react-icons/lia';
import CommentBox from './CommentBox';
import { useDispatch, useSelector } from 'react-redux';
import { setFocusedPost } from '../redux/store';

const Comment = ({ commentData }) => {

    const dispatch = useDispatch();

    const [replyBox, setReplyBox] = useState(false);
    const [isCommentVoted, setIsCommentVoted] = useState(0);

    const { focusedPost } = useSelector(state => state.app);
    const replies = focusedPost?.comments.filter(cmnt => cmnt.parent === commentData._id);
    // console.log(focusedPost, new Date().getTime())

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

    return (
        <div className='comment comment-main'>
            <div className="comment-user-profile">
                <img className='comment-user-profile-picture' src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png" alt="" />
                <span>{commentData?.username}</span>
            </div>
            <div className="comment-content">
                {commentData?.text}
            </div>
            <div className="comment-interactions">
                <BiSolidUpvote
                    size={20}
                    style={{ color: isCommentVoted === 1 ? '#ff4500' : '#d0d0d0' }}
                // onClick={(e) => { e.stopPropagation(); handleVote('up') }}
                />
                <span>{commentData.likes}</span>
                <BiSolidDownvote
                    size={20}
                    style={{ color: isCommentVoted === -1 ? '#7193ff' : '#d0d0d0' }}
                // onClick={(e) => { e.stopPropagation(); handleVote('down') }}
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