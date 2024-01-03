import React from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle, Settings, LocalPolice, Campaign, HelpOutline, Info, RecentActors, ExitToApp } from '@mui/icons-material';
import '../styles/SideBar.css'
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/store';

const SideBar = ({ user }) => {


    const toggleBtn = (e) => {
        if (e.target.classList.contains('active')) {
            e.target.classList.remove('active')
        } else {
            e.target.classList.add('active')
        }
    }

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setUser({ set:'token', token: null }))
    }

    return (
        <div className='sidebar'>
            <div className="sidebar-section">
                <div className="sidebar-section-head">
                    <AccountCircle sx={{ fontSize: '25px' }} />
                    <span>My Stuff</span>
                </div>
                <div className="sidebar-section-btns">
                    <Link to={`/u/${user?.userData?.username}`}>
                        Profile
                    </Link>
                    <Link to={`/u/${user?.userData?.username}/avatar`}>
                        Your Avatar
                    </Link>
                    <Link to={`/u/${user?.userData?.username}/saved`}>
                        Saved
                    </Link>
                    <Link to={`/u/${user?.userData?.username}/history`}>
                        History
                    </Link>
                </div>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-head">
                    <Settings sx={{ fontSize: '25px' }} />
                    <span>Options</span>
                </div>
                <div className="sidebar-section-btns">
                    <div>
                        <span>Mod Mode</span>
                        <div className="switch active" onClick={toggleBtn}></div>
                    </div>
                    <div>
                        <span>Dark Mode</span>
                        <div className="switch" onClick={toggleBtn}></div>
                    </div>
                    <Link to={'/settings'}>
                        User Settings
                    </Link>
                </div>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-head">
                    <LocalPolice sx={{ fontSize: '25px' }} />
                    <span>Premium</span>
                </div>
            </div>
            <div className="sidebar-section">
                <Link to={'/create/community'} className="sidebar-section-head">
                    <Campaign sx={{ fontSize: '25px' }} />
                    <span>Create Community</span>
                </Link>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-head">
                    <HelpOutline sx={{ fontSize: '25px' }} />
                    <span>Help</span>
                </div>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-head">
                    <Info sx={{ fontSize: '25px' }} />
                    <span>More</span>
                </div>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-head">
                    <RecentActors sx={{ fontSize: '25px' }} />
                    <span>Terms and Conditions</span>
                </div>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-section-head" onClick={handleLogout}>
                    <ExitToApp sx={{ fontSize: '25px' }} />
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    )
}

export default SideBar;
