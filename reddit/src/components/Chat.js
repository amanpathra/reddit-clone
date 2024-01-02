import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setChats, setConversation } from '../redux/store';


import ChatRoom from './ChatRoom';
import CreateChat from '../modals/CreateChat';
import '../styles/Chat.css';

const Chat = () => {

    const { chats } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const ref = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(chats[0]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://192.168.29.205:5000/api/chat/user-chats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': user.token,
                    },
                });

                const userChats = await response.json();
                dispatch(setChats({ type: 'SET_FETCHED_CHATS', chats: userChats }));
                setSelectedChat(chats[0]);
            } catch (error) {
                console.error('Error fetching user chats:', error.message);
                // Handle error (e.g., show a message to the user)
            }
        })();
    }, [dispatch, user.token])

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateChat = async (e) => {
        setIsModalOpen(true);
    }

    const selectChat = (e, idx) => {
        e.stopPropagation();
        setSelectedChat(chats[idx]);
    }

    return (
        <div className='chat'>
            <div className="chat-list">
                <div className="chat-list-head">
                    <h2>Chat</h2>
                    <div className="unread-badge">2</div>
                    <button className="create-chat" onClick={handleCreateChat} ref={ref}>+</button>
                </div>
                <div className="chat-list-chats">
                    <h3>CHATS</h3>
                    {chats?.length !== 0 ? (
                        chats?.map((chat, idx) => (
                            <div className={`chat-person${chat?._id === selectedChat?._id ? ' selected' : ''}`} onClick={(e) => selectChat(e, idx)}>
                                <img
                                    src={chat?.isGroupChat ? (
                                        'https://cdn.pixabay.com/photo/2019/08/11/18/48/icon-4399681_1280.png'
                                    ) : (
                                        chat?.participants
                                            .find(participantId => participantId !== user?.userData?._id)
                                            .image
                                    )}
                                    alt=""
                                />
                                <span>
                                    {chat?.isGroupChat ? (
                                        chat?.chatName
                                    ) : (
                                        chat?.participants
                                            .find(participant => participant._id !== user?.userData?._id)
                                            .username
                                    )}
                                </span>
                                <span>
                                    {chat?.latestMessage?.sender === user.userData._id ? 'You: ' : ''}
                                    {chat?.latestMessage?.content}
                                </span>
                            </div>
                        ))
                    ) : (
                        <span>No Chats</span>
                    )}
                </div>
            </div>
            <ChatRoom /*socket={socket}*/ reff={ref} selectedChat={selectedChat} user={user} />
            <CreateChat isOpen={isModalOpen} onClose={handleCloseModal} user={user} />
        </div>
    )
}

export default Chat;
