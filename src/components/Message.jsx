import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    return (
        <div className='message owner'>
            <div className="messageInfo">
                <img src="/" alt="" />
                <span>Just now</span>
            </div>
            <div className="messageContent">
                <p>Hello</p>
                <img src="https://static.vecteezy.com/system/resources/thumbnails/000/561/419/small/chat-06.jpg" alt="" />
            </div>
        </div>
    )
}

export default Message;