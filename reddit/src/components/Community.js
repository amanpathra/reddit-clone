import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FeedSort from './FeedSort';
import { setCommunity, setFeedPosts } from '../redux/store';
import FeedPost from './FeedPost';
import { formatDate } from '../middlewares/getTimeByDate';

import '../styles/Community.scss';
import { PiCakeLight } from "react-icons/pi";
import { IoPeopleOutline } from "react-icons/io5";

const Community = () => {

    const { community: communityName } = useParams();
    const { feedPosts } = useSelector(state => state.user);
    const { community } = useSelector(state => state.community);
    const dispatch = useDispatch();

    const [isFeedTab, setIsFeedTab] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await fetch(`http://192.168.29.205:5000/api/community/${communityName}`);
            const data = await res.json();
            dispatch(setCommunity({type: 'SET_COMMUNITY', community: data}))
        })();

        (async () => {
            const res = await fetch(`http://192.168.29.205:5000/api/post/fetchCommunityPosts/${communityName}`);
            const data = await res.json();
            dispatch(setFeedPosts({ type: 'SET_POSTS', posts: data }))
        })();
    }, [dispatch, communityName])

    const handleTabClick = (tab) => {
        setIsFeedTab(tab)
    }

    return (
        <div className='community'>
            <div className="community-hero">
                <div className="community-hero-banner">
                    <img src="https://media.sproutsocial.com/uploads/1c_facebook-cover-photo_clean@2x.png" alt="" />
                </div>
                <div className='community-hero-content'>
                    <div className="content-header">
                        <img src="https://pbs.twimg.com/profile_images/1729912073797201920/48aOtcFR_400x400.jpg" alt="" />
                        <div>
                            <div>
                                <h3 className='community-name'>{community?.frontline}</h3>
                                <button className='join-btn'>Joined</button>
                            </div>
                            <span>r/{community?.name}</span>
                        </div>
                    </div>
                    <div className="content-tab">
                        <button
                            onClick={() => handleTabClick(true)}
                            style={{ color: isFeedTab ? 'dodgerblue' : 'black' }}
                        >
                            Posts
                            <div style={{ backgroundColor: isFeedTab ? 'dodgerblue' : 'gray' }}>
                            </div>
                        </button>
                        <button
                            onClick={() => handleTabClick(false)}
                            style={{ color: !isFeedTab ? 'dodgerblue' : 'black' }}
                        >
                            Wiki
                            <div style={{ backgroundColor: !isFeedTab ? 'dodgerblue' : 'gray' }}>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="community-feed">
                {isFeedTab ? (
                    <div className="community-feed-box">
                        <FeedSort />
                        {feedPosts?.map(post => (
                            <FeedPost postId={post._id} key={post._id} communityPost />
                        ))}
                    </div>
                ) : (
                    <div className='community-wiki'>
                        <div className="wiki-section wiki-about">
                            <h4>About Community</h4>
                            <div>
                                    <p className='wiki-about-content'>{community?.about}</p>
                                <hr/>
                                <div className="wiki-info">
                                    <div>
                                        <PiCakeLight size={42}/>
                                        <span>{formatDate(community?.createdAt)}</span>
                                        <span>Created</span>
                                    </div>
                                    <div>
                                        <IoPeopleOutline size={42}/>
                                        <span>{community?.members}</span>
                                        <span>Members</span>
                                    </div>
                                </div>
                                <hr/>
                                <button>Create Post</button>
                            </div>
                        </div>
                        <div className="wiki-section wiki-rules">
                            <h4>r/{community?.name} Rules</h4>
                            <div className="rules">
                                <div className="rule">
                                    <h6>1. Only "Damnthatsinteresting" content</h6>
                                    <p>This subreddit is for things that are interesting and cool. Content that is only cute, funny, a meme, or 'mildly interesting' will be removed. Posts should be able to elicit a reaction of "Damnthatsinteresting". Posts not deemed DTI may be removed at mod discretion.</p>
                                </div>
                                <hr/>
                                <div className="rule">
                                    <h6>2. Use descriptive title</h6>
                                    <p>This subreddit is for things that are interesting and cool. Content that is only cute, funny, a meme, or 'mildly interesting' will be removed. Posts should be able to elicit a reaction of "Damnthatsinteresting". Posts not deemed DTI may be removed at mod discretion.</p>
                                </div>
                                <hr/>
                                <div className="rule">
                                    <h6>3. No rasism, bigotry, or hate speech</h6>
                                    <p>This subreddit is for things that are interesting and cool. Content that is only cute, funny, a meme, or 'mildly interesting' will be removed. Posts should be able to elicit a reaction of "Damnthatsinteresting". Posts not deemed DTI may be removed at mod discretion.</p>
                                </div>
                            </div>
                        </div>
                        <div className="wiki-section wiki-moderator">
                            <h4>Moderators</h4>
                            <ul>
                                <li>u/JonLuca</li>
                                <li>u/hjalmar111</li>
                                <li>u/LydiaAgain</li>
                                <li>u/metisdesigns</li>
                            </ul>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Community;