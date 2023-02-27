import React from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

const Home = () => {
    return (
        <div className='home d-flex'>
            <div className='side-bar'>
                <Sidebar />
            </div>
            <div className='content'>
                <div className=''>
                    <Chat />
                </div>
            </div>
        </div>
    )
}

export default Home;