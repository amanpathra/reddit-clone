import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setFocusedPost } from '../redux/store';

const CommentBox = ({ commentId }) => {

    const dispatch = useDispatch();

    const { user, focusedPost } = useSelector(state => state.user);

    const [comment, setComment] = useState({ text: '', markdown: false, anonymous: false });

    const submitComment = async (e) => {
        e.preventDefault();
        // console.log('submit func ran')
        const res = await fetch('http://192.168.29.205:5000/api/comment/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': user.token,
                'postid': focusedPost.id
            },
            body: JSON.stringify({ commentId: commentId ?? focusedPost.id, comment })
        })
        const submittedComment = await res.json();
        // console.log(submittedComment);

        setComment({ ...comment, text: '' });
        dispatch(setFocusedPost({ type: 'PUSH_COMMENT', comment: submittedComment }))
    }

    const handleToggle = (btn) => {
        setComment(state => {
            if (btn === 'markdown') {
                return {
                    ...comment,
                    markdown: state.markdown ? false : true
                }
            } else if (btn === 'anonymous') {
                return {
                    ...comment,
                    anonymous: state.anonymous ? false : true
                }
            }
        })
    }

    return (
        <div className="comment-input-box" style={{ marginBottom: commentId ? '0px' : '20px' }}>
            <textarea
                cols="90"
                rows="10"
                placeholder='What are your thoughts?'
                onChange={(e) => setComment({ ...comment, text: e.target.value })}
                value={comment.text}
                onFocus={(e) => e.target.parentElement.style.border = '1px solid #2d2d2d'}
                onBlur={(e) => e.target.parentElement.style.border = '1px solid #bebebe'}
            ></textarea>
            <div className="comment-post">
                <button
                    onClick={() => handleToggle('markdown')}
                    style={{ backgroundColor: comment.markdown ? 'lightgreen' : '#dfdfdf' }}
                >
                    Markdown Mode
                </button>
                <button
                    onClick={() => handleToggle('anonymous')}
                    style={{ backgroundColor: comment.anonymous ? 'lightgreen' : '#dfdfdf' }}
                >
                    Comment Anonymously
                </button>
                <button
                    className='comment-submit-btn'
                    onClick={submitComment}
                >
                    Comment
                </button>
            </div>
        </div>
    )
}

export default CommentBox;
