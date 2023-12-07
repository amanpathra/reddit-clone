import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import redditLogo from '../assets/Reddit-logo.png'
import '../styles/Login.css';
import { setUser } from '../redux/store';
import { useDispatch } from 'react-redux';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://192.168.29.205:5000/api/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })

        const data = await res.json();

        if(data.success){
            dispatch(setUser({set: 'token', token: data.authToken}));
            navigate('/');
        }else{
            alert(data.error)
        }
    }

    // const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // if (isMobile) {
    //     // The client is on a mobile device
    //     alert('Mobile');
    // } else {
    //     // The client is on a desktop
    //     alert('Desktop');
    // }
    
    return (
        <div className='login'>
            <div className="login-box">
                <img src={redditLogo} alt="" height={120}/>
                <form className="login-main" onSubmit={handleLoginSubmit}>
                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        Log In
                    </button>
                    <p>Forgot you <span>username</span> or <span>password</span>?</p>
                    <p>New to reddit? <Link to={'/signup'}>Sign Up.</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;