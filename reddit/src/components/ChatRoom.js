import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setChats, setConversation } from '../redux/store';

import { IoSettingsOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { PiPaperclipLight } from "react-icons/pi";
import { AiOutlineSend } from "react-icons/ai";

import '../styles/Chat.css';

const ChatBundle = ({ msg }) => {
    return (
        msg.sender === 'SERVER' ? (
            <div className='server-msg'>
                <span>{msg.text}</span>
            </div>
        ) : (
            <div className={`chat-bundle ${msg.sender === 'YOU' ? 'right' : 'left'}`}>
                <div className="chat-bundle-pfp">
                    <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                </div>
                <div className="chat-bundle-msgs">
                    <span>{msg.text}</span>
                </div>
            </div>
        )
    )
}

const ChatRoom = ({ /*socket*/ reff, selectedChat, user }) => {

    const [message, setMessage] = useState('');

    const { conversation, chats } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    const chatRoomChatRef = useRef(null);

    const socket = io('http://192.168.29.205:5000', {
        withCredentials: true,
        extraHeaders: {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "http://192.168.29.205:5000"
        }
    });

    useEffect(() => {
        // Load/update chat
        const fetchTheChat = async () => {
            const res = await fetch(`http://192.168.29.205:5000/api/message/get/${selectedChat?._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': user.token,
                }
            })
            const chat = await res.json();
            const storableChat = chat?.map(msg => {
                return {
                    sender: msg.sender === user.userData._id ? 'YOU' : 'PARTICIPANT',
                    text: msg.content
                }
            })
            // sessionStorage.setItem(selectedChat?._id, JSON.stringify(storableChat));
            dispatch(setConversation({ type: 'SET_CHAT', chat: storableChat, selectedChat }));
        };
        if (selectedChat) fetchTheChat();
        // Check if the chat is stored in the session storage or not? If it is then don't request the server to fetch.
        // if (!sessionStorage.getItem(selectedChat?._id)) {
        //     fetchTheChat();
        // } else{
        //     dispatch(setConversation({type: 'SET_CHAT', chat: JSON.parse(sessionStorage.getItem(selectedChat?._id))}))
        // }

        // Join the chat room
        socket.emit('join', selectedChat?._id);

        // Listen for incoming chat messages
        socket.on('recieve', message => {
            // Update the messages state with the new message
            // setMessages((prevMessages) => [...prevMessages, newMessage]);
            // console.log(message, user);
            if (message.sender !== user.userData._id) dispatch(setConversation({ type: 'RECIEVE', message: message.content }));
            dispatch(setChats({type: 'SET_LATEST_MSG', message}));
        });

        return () => {
            // Clean up the socket connection when the component unmounts
            socket.disconnect();
        };
    }, [selectedChat?._id]);

    const scrollToLast = () => {
        document.getElementById('divForView').scrollIntoView({behavior: 'smooth'})
    }

    const send = async () => {
        try {
            const response = await fetch('http://192.168.29.205:5000/api/message/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': user.token,
                },
                body: JSON.stringify({
                    chatId: selectedChat?._id,
                    content: message,
                }), 
            });

            const newMessage = await response.json();
            // Handle the new message as needed (e.g., update the UI)
            // console.log('New message:', newMessage);

            // Clear the input field after sending the message
            // const chat = sessionStorage.getItem(selectedChat?._id);
            // const chatUpdate = chat ? JSON.parse(chat) : [];
            // console.log(chatUpdate);
            // chatUpdate.push({sender: 'YOU', text: message});
            // sessionStorage.setItem(selectedChat?._id, JSON.stringify(chatUpdate));
            dispatch(setConversation({ type: 'SEND', message }));
            setMessage('');
            scrollToLast();
        } catch (error) {
            console.error('Error sending message:', error.message);
            // Handle the error (e.g., show a message to the user)
        }
    }

    const handleCreateConvo = () => {
        reff.current.click();
    }

    return (
        <div className="chat-room">
            {chats.length !== 0 ? (
                <>
                    <div className="chat-room-head">
                        <img
                            src={
                                selectedChat?.isGroupChat ? (
                                    'https://cdn.pixabay.com/photo/2019/08/11/18/48/icon-4399681_1280.png'
                                ) : (
                                        selectedChat?.participants
                                        .find(participantId => participantId !== user?.userData?._id)
                                        .image
                                )
                            }
                            alt=""
                        />
                        <span>
                            {selectedChat?.isGroupChat ? selectedChat?.chatName : selectedChat?.participants?.find(participant => participant._id !== user?.userData?._id).username}
                        </span>
                        <IoSettingsOutline size={24} />
                        <RxCross2 size={24} />
                    </div>
                    <div className="chat-room-chat" ref={chatRoomChatRef}>
                        {conversation.chat.map(msg => {
                            return <ChatBundle msg={msg} key={msg._id}/>
                        })}
                        <div id="divForView"></div>
                    </div>
                    <div className="chat-room-send">
                        <PiPaperclipLight size={28} />
                        <input type="text" className='chat-room-send-input' value={message} onChange={(e) => setMessage(e.target.value)} />
                        <AiOutlineSend size={28} onClick={send} />
                    </div>
                </>
            ) : (
                <button onClick={handleCreateConvo}>Start your first conversation</button>
            )}
        </div>
    )
}

export default ChatRoom;