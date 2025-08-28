import React, { useContext, useState, useEffect } from 'react';
import './Sidebar.css';
import { RssFeed, Chat, Groups, Bookmark, HelpOutline, Event, WorkOutline, School, PlayCircleFilledOutlined } from "@mui/icons-material";
import { Users } from '../../dummyData';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Sidebar() {
    const pf = import.meta.env.VITE_PUBLIC_FOLDER; // Path to public folder (for images)
    const [friends, setFriends] = useState([]); // State to store friend list
    const { user } = useContext(AuthContext); // Access current user from Auth context

    // Fetch user's friends when component mounts or user._id changes
    useEffect(() => {
        const getFriends = async () => {
            if (!user._id) return;
            try {
                const friendList = await axios.get(`https://we-meet-mecf4.sevalla.app//api/users/friends/${user._id}`);
                setFriends(friendList.data); // Set retrieved friends
            } catch (err) {
                console.error("Error fetching friends:", err.response?.data || err.message);
            }
        };
        getFriends();
    }, [user._id]);

    return (
        <div className='sidebar'>
            <div className='sidebar-container'>
                {/* Sidebar items with icons and labels */}
                <div className='list-item'>
                    <RssFeed />
                    <span className='list-name'>Feed</span>
                </div>
                <div className='list-item'>
                    <Chat />
                    <span className='list-name'>Chats</span>
                </div>
                <div className='list-item'>
                    <PlayCircleFilledOutlined />
                    <span className='list-name'>Videos</span>
                </div>
                <div className='list-item'>
                    <Bookmark />
                    <span className='list-name'>Bookmark</span>
                </div>
                <div className='list-item'>
                    <HelpOutline />
                    <span className='list-name'>Questions</span>
                </div>
                <div className='list-item'>
                    <Groups />
                    <span className='list-name'>Groups</span>
                </div>
                <div className='list-item'>
                    <WorkOutline />
                    <span className='list-name'>Jobs</span>
                </div>
                <div className='list-item'>
                    <Event />
                    <span className='list-name'>Events</span>
                </div>
                <div className='list-item'>
                    <School />
                    <span className='list-name'>Courses</span>
                </div>
            </div>

            {/* <div className='button-div'>
                <a href='' className='button'>Show more</a>
            </div> */}

            <hr style={{marginTop:"10px"}} />

            {/* <div className='friend-list'>
                {Array.isArray(friends) && friends.map((friend) => (
                    <div className='set'>
                        <img className='profile-img' src={friend.profilePicture ? pf + friend.profilePicture : pf + '1.jpeg'} />
                        <span>{friend.username}</span>
                    </div>
                ))}
            </div> */}
        </div>
    )
}

export default Sidebar;
