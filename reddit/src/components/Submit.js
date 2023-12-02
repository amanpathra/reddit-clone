import React, { useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { GoChevronDown } from 'react-icons/go';
import { CiShoppingTag } from 'react-icons/ci';
import '../styles/Submit.css'
import { useDispatch, useSelector } from 'react-redux';
import { setFeedPosts } from '../redux/store';
import { useNavigate } from 'react-router-dom';

const Submit = () => {

    const [communityValue, setCommunityValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [textValue, setTextValue] = useState('');
    const [flairValue, setFlairValue] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.app)

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/api/post/submit', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": user.token
            },
            body: JSON.stringify({
                community: communityValue,
                title: titleValue,
                text: textValue,
                flair: flairValue
            })
        });

        const data = await res.json();
        dispatch(setFeedPosts({post: data}))
        navigate('/')
    }
    
    return (
        <div className='submit'>
            <div className="submit-box">
                <h2>Create a post</h2>
                <form className="submit-main" onSubmit={handlePostSubmit}>
                    <div className="submit-community">
                        <GoSearch/>
                        <span>r/</span>
                        <input
                            type="text"
                            placeholder='Choose a community'
                            value={communityValue}
                            onChange={(e) => setCommunityValue(e.target.value)}
                        />
                        <GoChevronDown/>
                    </div>
                    <div className="submit-title">
                        <input 
                            type="text"
                            placeholder='Title'
                            value={titleValue}
                            onChange={(e) => setTitleValue(e.target.value)}
                        />
                    </div>
                    <div className="submit-text">
                        <textarea
                            cols="30"
                            rows="30>"
                            placeholder='Text'
                            onChange={(e) => setTextValue(e.target.value)}
                            value={textValue}
                        ></textarea>
                    </div>
                    <div className="submit-flair">
                        <div className="submit-flair-box">
                            <CiShoppingTag/>
                            <input
                                type="text"
                                placeholder='Add a flair'
                                value={flairValue}
                                onChange={(e) => setFlairValue(e.target.value)}
                            />
                            {/* <span role='textbox' contentEditable>
                                Falir
                            </span> */}
                        </div>
                    </div>
                    <div className="submit-post">
                        <button type="submit">Post</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Submit;
