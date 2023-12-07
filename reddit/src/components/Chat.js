import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setConversation } from '../redux/store';
import { io } from 'socket.io-client';

import { IoSettingsOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { PiPaperclipLight } from "react-icons/pi";
import { AiOutlineSend } from "react-icons/ai";

import '../styles/Chat.css';

const ChatBundle = ({ msg }) => {
    return (
        <div className={`chat-bundle ${msg.sender === 'YOU' ? 'right' : 'left'}`}>
            <div className="chat-bundle-pfp">
                <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
            </div>
            <div className="chat-bundle-msgs">
                <span>{msg.text}</span>
            </div>
        </div>
    )
}


const Chat = () => {

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    // const [socket, setSocket] = useState(null);

    // const { conversation, user } = useSelector(state => state.app);
    // const dispatch = useDispatch();s

    // setChat(conversation?.chat);

    const socket = io('http://192.168.29.205:8000', {
        withCredentials: true,
        extraHeaders: {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "http://192.168.29.205:8000"
        }
    });

    // setSocket(newSocket);

    // while(!socket){
    //     console.log(socket)
    // }

    useEffect(() => {
        socket.on('recieve', data => {
            // setChat([...chat, { sender: 'PARTICIPANT', text: data.message }])
            setChat(state => [...state, { sender: 'PARTICIPANT', text: data.message }])
        })

        return () => {
            socket.off('recieve');
        }
    
    }, [])
    
    const send = () => {
        const newMessage = { sender: 'YOU', text: message };

        setChat(state => [...state, newMessage])
        // setChat([...chat, { sender: 'YOU', text: message }])
        socket.emit('send', message)
        setMessage('');
    }


    return (
        <div className='chat'>
            <div className="chat-list">
                <div className="chat-list-head">
                    <h2>Chat</h2>
                    <div className="unread-badge">2</div>
                    <div className="create-chat">+</div>
                </div>
                <div className="chat-list-chats">
                    <h3>CHATS</h3>
                    <div className="chat-person">
                        <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                        <span>finn_flames</span>
                        <span>this is the latest msg</span>
                    </div>
                    <div className="chat-person">
                        <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                        <span>finn_flames</span>
                        <span>this is the latest msg</span>
                    </div>
                    <div className="chat-person">
                        <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                        <span>finn_flames</span>
                        <span>this is THE the latest msg</span>
                    </div>
                </div>
            </div>
            <div className="chat-room">
                <div className="chat-room-head">
                    <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                    <span>finn_flames</span>
                    <IoSettingsOutline size={24} />
                    <RxCross2 size={24} />
                </div>
                <div className="chat-room-chat">
                    <div className="chat-bundle left">
                        <div className="chat-bundle-pfp">
                            <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                        </div>
                        <div className="chat-bundle-msgs">
                            <span>Hello</span>
                            <span>What kind of style are you into?</span>
                        </div>
                    </div>
                    <div className="chat-bundle right">
                        <div className="chat-bundle-pfp">
                            <img src='https://w7.pngwing.com/pngs/193/660/png-transparent-computer-icons-woman-avatar-avatar-girl-thumbnail.png' alt="" />
                        </div>
                        <div className="chat-bundle-msgs">
                            <span>Hey!</span>
                            <span>Nothing really specific.</span>
                        </div>
                    </div>
                    {chat.map(msg => {
                        return <ChatBundle msg={msg} />
                    })}
                </div>
                <div className="chat-room-send">
                    <PiPaperclipLight size={28} />
                    <input type="text" className='chat-room-send-input' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <AiOutlineSend size={28} onClick={send} />
                </div>
            </div>
        </div>
    )
}

export default Chat;
