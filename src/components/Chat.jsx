import React, { useContext } from 'react'
import { AiOutlineUserAdd } from "react-icons/ai";
import { CiCircleMore } from "react-icons/ci";
import { BsCameraVideo } from "react-icons/bs";
import Messages from './Messages';
import InputCustom from './InputCustom';
import { ChatContext } from '../context/ChatContext';
const Chat = () => {
    const { data } = useContext(ChatContext);

    return (
        <div className="chat" style={{ height: "100vh" }}>
            <div className="chatInfo d-flex justify-content-between align-items-center" style={{ height: "50px" }}>
                <span className='name-user'>
                    {data.user?.displayName}
                </span>
                <div className="chatIcons">
                    <AiOutlineUserAdd className='fs-2' />
                    <BsCameraVideo className='fs-2' />
                    <CiCircleMore className='fs-2' />
                </div>
            </div>
            <div
                className="d-flex justify-content-end flex-column"
                style={{ height: 'calc(100% - 56px)' }}
            >
                <Messages />
                <InputCustom />
            </div>
        </div>
    )
}

export default Chat;