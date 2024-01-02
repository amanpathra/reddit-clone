import React, { useState } from 'react';
import '../styles/CreateCommunity.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateCommunity = () => {

    const [nameValue, setNameValue] = useState('');
    const [frontlineValue, setFrontlineValue] = useState('');
    const [aboutValue, setAboutValue] = useState('');
    const [anyError, setAnyError] = useState(null);

    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);

    const handleCreateCommunity = async (e) => {
        e.preventDefault();

        const res = await fetch('http://192.168.29.205:5000/api/community/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": user.token
            },
            body: JSON.stringify({
                name: nameValue,
                frontline: frontlineValue,
                about: aboutValue,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/768px-JavaScript-logo.png'
            })
        });

        const data = await res.json();
         
        if (data.success) {
            navigate(`/r/${data.community.name}`);
        } else {
            setAnyError(data.erorr);
        }
    }

    return (
        <div className='submit'>
            <div className="submit-box">
                <h2>Create a community</h2>
                <form className="submit-main" onSubmit={handleCreateCommunity}>
                    <div className="submit-name">
                        <h3>Name</h3>
                        <p>Community names including capitalization cannot be changed.</p>
                        {anyError && <p>{anyError}</p>}
                        <div>
                            <span>r/</span>
                            <input
                                type="text"
                                placeholder='Choose a name'
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                maxLength={21}
                                required
                            />
                            <span>{nameValue.length}/21</span>
                        </div>
                    </div>
                    <div className="submit-frontline">
                        <h3>Frontline</h3>
                        <p>Write a one-liner for your community</p>
                        <div>
                            <input
                                type="text"
                                placeholder='Frontline...'
                                value={frontlineValue}
                                onChange={(e) => setFrontlineValue(e.target.value)}
                                maxLength={60}
                                required
                            />
                            <span>{frontlineValue.length}/60</span>
                        </div>
                    </div>
                    <div className="submit-about">
                        <h3>About Community</h3>
                        <p>Describe your community</p>
                        <textarea
                            cols="30"
                            rows="5"
                            placeholder='Text'
                            onChange={(e) => setAboutValue(e.target.value)}
                            value={aboutValue}
                            require
                        ></textarea>
                    </div>
                    <div className="submit-post">
                        <button onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCommunity;