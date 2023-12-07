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

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(state => state.app);

    useEffect(() => {
        if (!user.token && location.pathname !== '/signup') navigate('/login')
    }, [user.token, navigate])
    
    return (
        <div className="App">
            {user.token ? (
                <>
                    <Nav />
                    <div className="main">
                        <Routes>
                            <Route exact path='/' element={<Feed />} />
                            <Route exact path='/submit' element={<Submit />} />
                            <Route path='/post/:postId' element={<Post />} />
                            <Route exact path='/chat' element={<Chat />} />
                        </Routes>
                        <SideBar/>
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