import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setFeedPosts, setProfileUser } from '../redux/store';
import FeedPost from './FeedPost';
import FeedSort from './FeedSort';
import { formatDate } from '../middlewares/getTimeByDate';
import { PiCakeLight } from 'react-icons/pi';
import { IoPeopleOutline } from 'react-icons/io5';
import PostShort from './PostShort';

const Profile = () => {

    const { username } = useParams();
    const { user, feedPosts } = useSelector(state => state.user);
    const { profileUser } = useSelector(state => state.profile);
    const dispatch = useDispatch();

    const [feedTab, setFeedTab] = useState(null);

    useEffect(() => {
        (async () => {
            const res = await fetch(`http://192.168.29.205:5000/api/auth/getUserByUsername/${username}`);
            const user = await res.json();
            dispatch(setProfileUser({ type: 'SET_USER', user }));
        })();
        setFeedTab('About');
    }, [dispatch, username])

    const fetchPosts = async (Tab) => {
        const res = await fetch(`http://192.168.29.205:5000/api/post/${username}/fetch/${Tab}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "auth-token": user.token,
            }
        })
        const data = await res.json();
        dispatch(setFeedPosts({ type: 'SET_POSTS', posts: data.isComments ? data.comments.map(comment => comment.post) : data.posts }))
    }

    const handleTabClick = (e) => {
        e.stopPropagation();
        setFeedTab(e.target.innerText);
        Array.from(e.target.parentNode.children).forEach(btn => {
            btn.style.color = 'black';
            btn.children[0].style.backgroundColor = 'gray';
        })
        e.target.style.color = 'dodgerblue';
        e.target.children[0].style.backgroundColor = 'dodgerblue';

        if (e.target.innerText !== 'About') fetchPosts(e.target.innerText);
    }

    return (
        <div className='community'>
            <div className="community-hero">
                <div className="community-hero-banner">
                    <img src={profileUser?.banner} alt="" />
                </div>
                <div className='community-hero-content'>
                    <div className="content-header">
                        <img src={profileUser?.image} alt="" />
                        <div>
                            <div>
                                <h3 className='community-name'>{profileUser?.name}</h3>
                                <button className='join-btn'>Joined</button>
                            </div>
                            <span>u/{profileUser?.username}</span>
                        </div>
                    </div>
                    <div className="content-tab">
                        <button onClick={handleTabClick}>About<div></div></button>
                        <button onClick={handleTabClick}>Posts<div></div></button>
                        {profileUser?._id === user.userData?._id && (
                            <>
                                <button onClick={handleTabClick}>Saved<div></div></button>
                                <button onClick={handleTabClick}>Upvoted<div></div></button>
                                <button onClick={handleTabClick}>Downvoted<div></div></button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="community-feed">
                {feedTab === 'Posts' ? (
                    <div className="community-feed-box">
                        <FeedSort />
                        {feedPosts?.map(post => (
                            <FeedPost postId={post._id} key={post._id} communityPost />
                        ))}
                    </div>
                ) : feedTab === 'About' ? (
                    <div className='community-wiki'>
                        <div className="wiki-section wiki-about">
                            <h4>About u/{profileUser?.username}</h4>
                            <div>
                                <p className='wiki-about-content'>{profileUser?.bio}</p>
                                <hr />
                                <div className="wiki-info">
                                    <div>
                                        <PiCakeLight size={42} />
                                        <span>Birthday</span>
                                        <span>{formatDate(profileUser?.date, 'DD Mmm')}</span>
                                    </div>
                                    <div>
                                        <IoPeopleOutline size={42} />
                                        <span>Followers</span>
                                        <span>{profileUser?.followers?.length}</span>
                                    </div>
                                </div>
                                <hr />
                                <button>Message</button>
                            </div>
                        </div>
                        <div className="wiki-section wiki-moderator">
                            <h4>Moderators of</h4>
                            <ul>
                                <li>r/JonLuca</li>
                                <li>r/hjalmar111</li>
                                <li>r/LydiaAgain</li>
                                <li>r/metisdesigns</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className='profile-feed'>
                        {feedPosts?.map(post => (
                            <PostShort postId={post.id} key={post.id} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
} 

export default Profile;