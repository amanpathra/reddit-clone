import React, { useEffect, useState } from 'react';

import { Rocket, Whatshot, Label, TrendingUp } from '@mui/icons-material';

import '../styles/Feed.css'
import FeedPost from './FeedPost';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/store';

const Feed = () => {

    const [userLikedPosts, setUserLikedPost] = useState(null)

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.app)

    useEffect(async () => {
        const res = await fetch('http://localhost:5000/api/post/fetchAllPosts');
        const data = await res.json();
        dispatch(setPosts(null))
        data.forEach(post => {
            dispatch(setPosts({post}))
        })

        const checkForPostLiked = await fetch('http://localhost:5000/api/auth/getUser', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "auth-token": user,
                "get": 'loggedInUser'
            }
        })
        const loggedUserLikedPosts = await checkForPostLiked.json();
        setUserLikedPost(loggedUserLikedPosts);

    }, [])

    const toggleSortBtn = (e) => {
        Array.from(e.target.parentNode.children).forEach(elem => elem.classList.remove('feed-sort-btn-active'));
        e.target.classList.add('feed-sort-btn-active');
    }

    const { posts } = useSelector(state => state.app);

    return (
        <div className='feed'>
            <div className="feed-box">
                <div className="feed-sort">
                    <button className="feed-sort-btn feed-sort-btn-active" onClick={toggleSortBtn}>
                        <Rocket />
                        <span>Best</span>
                    </button>
                    <button className="feed-sort-btn" onClick={toggleSortBtn}>
                        <Whatshot />
                        <span>Hot</span>
                    </button>
                    <button className="feed-sort-btn" onClick={toggleSortBtn}>
                        <Label />
                        <span>New</span>
                    </button>
                    <button className="feed-sort-btn" onClick={toggleSortBtn}>
                        <TrendingUp />
                        <span>Top</span>
                    </button>
                </div>

                {posts?.map((post, idx) => (
                    <FeedPost post={post} idx={idx} key={post._id} userLikedPosts={userLikedPosts}/>
                ))}
            </div>
        </div>
    )
}

export default Feed;