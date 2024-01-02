import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import '../styles/Chat.css';
import { useDispatch, useSelector } from 'react-redux';
import { setChats } from '../redux/store';

const CreateChat = ({ isOpen, onClose, children, user }) => {

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [participants, setParticipants] = useState([]);

    const dispatch = useDispatch();
    const ref = useRef(null);

    const handleInputChange = async (e) => {
        setQuery(e.target.value);
        const res = await fetch('http://192.168.29.205:5000/api/auth/getUserSuggestions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': user.token,
                'query': query
            }
        })
        const userSuggestions = (await res.json()).users;

        const filteredUsers = userSuggestions.filter(userSuggestion => {
            return userSuggestion._id !== user.userData._id && !participants.map(user => user._id).includes(userSuggestion._id);
        })

        setSuggestions(filteredUsers);
    }

    const addParticipant = (suggestion) => {
        setParticipants(state => [...state, suggestion])
        setSuggestions([]);
        setQuery([]);
    }
    
    const removeParticipant = (userId) => {
        setParticipants(prev => prev.filter(participant => { console.log(participant._id !== userId); return participant._id !== userId }));
    }

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent black overlay
        },
        content: {
            width: '50%',
            height: 'fit-content',
            maxHeight: '80%',
            margin: 'auto',
            border: '2px solid #aaa',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#fff',
            zIndex: '2'
        },
    }

    const handleCreateChat = async () => {
        try{
            const response = await fetch('http://192.168.29.205:5000/api/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': user.token,
                },
                body: JSON.stringify({ participants })
            })
            const newChat = await response.json();
            console.log(newChat);
            dispatch(setChats({ type: 'ADD_NEW_CHAT', chat: newChat }));
            ref.current.click();
        } catch (error) {
            console.error('Error creating chat:', error.message);
        }
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <div className='create-chat-modal'>
                <h2>Create Chat</h2>
                <div className='create-chat-modal-main'>
                    <input type="text" value={query} onChange={handleInputChange} placeholder='Seach for users...' />
                    {suggestions.length > 0 && (
                        <ul className='create-chat-user-suggestion'>
                            {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => addParticipant(suggestion)}>
                                    <img src={suggestion.image} alt="" />
                                    <span>{suggestion.username}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="create-chat-participants">
                        <h4>Participants:</h4>
                        <ul>
                            {participants.map((participant, idx) => (
                                <li key={idx}>
                                    <img src={participant.image} alt="" />
                                    <span>{participant.username}</span>
                                    <button onClick={() => removeParticipant(participant._id)}>✕</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="create-chat-buttons">
                    <button className='cancel' onClick={onClose} ref={ref}>Cancel</button>
                    <button className={`create${participants.length === 0 ? ' disabled' : ''}`} onClick={handleCreateChat} disabled={participants.length === 0 ? true : false}>Create Chat</button>
                </div>
            </div>
            {children}
        </Modal>
    )
}

export default CreateChat;
