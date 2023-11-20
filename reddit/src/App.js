import './App.css';
import { Routes, Route } from "react-router-dom";
import Nav from './components/Nav';
import Feed from './components/Feed';
import SideBar from './components/SideBar';
import Submit from './components/Submit';
import Login from './components/Login';
import authImg from './assets/redditAuthImg.webp';
import Signup from './components/Signup';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

    const navigate = useNavigate();
    const { user } = useSelector(state => state.app);

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }else{
            navigate('/')
        }
    }, [user, navigate])
    
    return (
        <div className="App">
            {user ? (
                <>
                    <Nav />
                    <div className="main">
                        <Routes>
                            <Route exact path='/' element={<Feed />} />
                            <Route exact path='/submit' element={<Submit />} />
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