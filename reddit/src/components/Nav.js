import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import RedditLogo from '../assets/Reddit-logo.png';
import { Search, Chat, Add, Notifications, KeyboardArrowDown} from '@mui/icons-material';

import '../styles/Nav.css'

const Nav = () => {

    const [searchVal, setSearchVal] = useState('');
    
    return (
        <nav className='nav'>
            <div className="nav-logo">
                <Link to='/'>
                    <img src={RedditLogo} alt="Logo" height={60}/>
                </Link>
            </div>
            <div className="nav-search">
                <div className="nav-search-main">
                    <Search sx={{fontSize: '32px', color: 'gray'}}/>
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
                    <Chat sx={{fontSize: '20px'}}/>
                    <span>Chat</span>
                </Link>
                <Link to={'/submit'} className='nav-btn'>
                    <Add sx={{fontSize: '20px'}}/>
                    <span>Create Post</span>
                </Link>
                <Link to={'/notifications'} className='nav-btn'>
                    <Notifications sx={{fontSize: '20px'}} />
                    <span>Notifications</span>
                </Link>
            </div>
            <div className="nav-account">
                <div className="dropdown-btn">
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="profile" height={32}/>
                    <div className="dropdown-btn-user">
                        <span>amanpathra</span>
                        <span>4.3k Karma</span>
                    </div>
                    <KeyboardArrowDown/>
                </div>
            </div>
        </nav>
    )
}

export default Nav;