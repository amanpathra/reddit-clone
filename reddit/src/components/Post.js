import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { setFocusedPost } from '../redux/store';

import FeedPost from './FeedPost';
import Comment from './Comment';

import '../styles/Post.css'
import { Label, Rocket } from '@mui/icons-material';
import CommentBox from './CommentBox';

const Post = () => {

    const dispatch = useDispatch();

    const { focusedPost } = useSelector(state => state.app);
    
    const [mainComments, setMainComments] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:5000/api/comment/getPostComments', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'postid': focusedPost?.id
                }
            })
            const postCommets = await res.json();
            dispatch(setFocusedPost({ type: 'SET_COMMENTS', comments: postCommets }));
            setMainComments(focusedPost?.comments?.filter(cmnt => cmnt.parent === focusedPost?.id))
        })();
    }, [dispatch, focusedPost.id])

    const toggleSortBtn = (e) => {
        Array.from(e.target.parentNode.children).forEach(elem => elem.classList.remove('comment-sort-btn-active'));
        e.target.classList.add('comment-sort-btn-active');
    }

    return (
        <div className='post'>
            <div className="post-box">
                <FeedPost postId={focusedPost.id} alone />
                <div className="post-comment">
                    <h3>Comments</h3>
                    <CommentBox key={1}/>
                    <div className="comment-section">
                        <div className="comment-sort">
                            <span>Sort by:</span>
                            <button className="comment-sort-btn comment-sort-btn-active" onClick={toggleSortBtn}>
                                <Rocket />
                                <span>Top</span>
                            </button>
                            <button className="comment-sort-btn" onClick={toggleSortBtn}>
                                <Label />
                                <span>New</span>
                            </button>
                        </div>
                        <div className="comments">
                            {mainComments?.map(cmnt => (
                                <Comment commentData={cmnt} key={cmnt._id}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post;