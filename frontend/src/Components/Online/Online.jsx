import React, { useEffect, useState } from 'react';
import './Online.css';
import axios from 'axios';

function Online({ conversation, currentUser, }) {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const [user, setUser] = useState(null);

    // get user(friend)
    useEffect(() => {
        if(!conversation || !conversation.members || !currentUser._id) return;
        const friendId = conversation.members.find((m) => m !== currentUser._id);
        const getUser = async () => {
            try {
                const res = await axios.get("https://we-meet-1-h00i.onrender.com/api/users?userId=" + friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentUser, conversation]);
    if (!user) return null;
    return (
        <div className='online'>       
         {/*user profile picture and username */}
            <div className='online-friend'>
                <img className='chat-image' src={user.profilePicture? PF+ user.profilePicture: PF + '1.jpeg'} />
                <span className='chat-username'>{user.username} </span>
            </div>
           
        </div>
    )
}

export default Online
