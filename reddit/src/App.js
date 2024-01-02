import './App.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Nav from './components/Nav';
import Feed from './components/Feed';
import SideBar from './components/SideBar';
import Submit from './components/Submit';
import Login from './components/Login';
import Signup from './components/Signup';
import Post from './components/Post';
import Chat from './components/Chat';
import authImg from './assets/redditAuthImg.webp';
import Community from './components/Community';
import CreateCommunity from './components/CreateCommunity';
import Profile from './components/Profile';

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        if (!user.token && location.pathname !== '/signup') navigate('/login')
    }, [user.token, navigate, location.pathname])
    
    return (
        <div className="App">
            {user.token ? (
                <>
                    <Nav />
                    <div className="main">
                        <Routes>
                            <Route exact path='/' element={<Feed />} />
                            <Route exact path='/create/post' element={<Submit />} />
                            <Route exact path='/create/community' element={<CreateCommunity />} />
                            <Route path='/post/:postId' element={<Post />} />
                            <Route path='/r/:community' element={<Community />} />s
                            <Route path='/u/:username' element={<Profile />} />
                            <Route exact path='/chat' element={<Chat />} />
                        </Routes>
                        <SideBar user={user}/>
                    </div>
                </>
            ) : (
                <div className="auth">
                    <Routes>
                        <Route exact path={'/login'} element={<Login />}></Route>
                        <Route exact path={'/signup'} element={<Signup />}></Route>
                    </Routes>
                    <div className="auth-image">
                        <p>Home to thousand of communities.</p>
                        <img src={authImg} alt="" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;