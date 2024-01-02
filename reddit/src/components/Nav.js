import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/store';

import { Search, Chat, Add, Notifications, KeyboardArrowDown } from '@mui/icons-material';

import '../styles/Nav.css'
import RedditLogo from '../assets/Reddit-logo.png';

const Nav = () => {

    const dispatch = useDispatch();
    
    const { user } = useSelector(state => state.user);

    const [searchVal, setSearchVal] = useState('');
    
    useEffect(() => {
        (async () => {
            const resUser = await fetch('http://192.168.29.205:5000/api/auth/getUser', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": user.token
                }
            })
            const resUserData = await resUser.json();
            dispatch(setUser({ set: 'userData', userData: resUserData }));
        })();
    }, [user.token, dispatch])
    

    return (
        <nav className='nav'>
            <div className="nav-logo">
                <Link to='/'>
                    <img src={RedditLogo} alt="Logo" height={60} />
                </Link>
            </div>
            <div className="nav-search">
                <div className="nav-search-main">
                    <Search sx={{ fontSize: '32px', color: 'gray' }} />
                    <input
                        type="search"
                        placeholder='Search Reddit'
                        className='nav-search-input'
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                    />
                </div>
            </div>
            <div className="nav-buttons">
                <Link to={'/chat'} className='nav-btn'>
                    <Chat sx={{ fontSize: '20px' }} />
                    <span>Chat</span>
                </Link>
                <Link to={'/create/post'} className='nav-btn'>
                    <Add sx={{ fontSize: '20px' }} />
                    <span>Create Post</span>
                </Link>
                <Link to={'/notifications'} className='nav-btn'>
                    <Notifications sx={{ fontSize: '20px' }} />
                    <span>Notifications</span>
                </Link>
            </div>
            <div className="nav-account">
                <div className="dropdown-btn">
                    <img src={user.userData?.image} alt="profile" height={32} />
                    <div className="dropdown-btn-user">
                        <span>{user.userData?.username}</span>
                        <span>4.3k Karma</span>
                    </div>
                    <KeyboardArrowDown />
                </div>
            </div>
        </nav>
    )
}

export default Nav;