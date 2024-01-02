import React, { useEffect } from 'react';

import '../styles/Feed.css'
import FeedPost from './FeedPost';
import { useDispatch, useSelector } from 'react-redux';
import { setFeedPosts } from '../redux/store';
import FeedSort from './FeedSort';

const Feed = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.user)

    useEffect(() => {
        (async () => {
            const res = await fetch('http://192.168.29.205:5000/api/post/fetchAllPosts');
            const data = await res.json();
            dispatch(setFeedPosts({type: 'SET_POSTS', posts: data}))
        })();
    }, [dispatch, user])

    const { feedPosts } = useSelector(state => state.user);

    return (
        <div className='feed'>
            <div className="feed-box">
                <FeedSort />
                {feedPosts?.map(post => (
                    <FeedPost postId={post._id} key={post._id}/>
                ))}
            </div>
        </div>
    )
}

export default Feed;