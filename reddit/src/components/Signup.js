import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import redditLogo from '../assets/Reddit-logo.png'
import '../styles/Login.css'
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/store';

const Signup = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignupSubmit = async(e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({username, email, password})
        })

        const data = await res.json();
        console.log(data.authToken, 'd')
        
        // if(data.success){
        //     localStorage.setItem('token', data.authToken);
        // }

        if(data.success){
            dispatch(setUser({user: data.authToken}));
            navigate('/')
        }
    }
    
    return (
        <div className='login'>
            <div className="login-box">
                <img src={redditLogo} alt="" height={120} />
                <form className="login-main" onSubmit={handleSignupSubmit}>
                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Email Adress'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Create Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        Sign Up
                    </button>
                    <p>By continuing, you indicate that you agree to Reddit's <span>Terms of Service</span> and <span>Privacy Policy</span>.</p>
                    <p>Already a redditor? <Link to={'/login'}>Log In.</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Signup;