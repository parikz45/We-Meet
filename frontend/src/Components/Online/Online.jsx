import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Online({ conversation, currentUser, onlineUsers = [] }) {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const [user, setUser] = useState(null);

    // get user(friend)
    useEffect(() => {
        if (!conversation || !conversation.members || !currentUser._id) return;
        const friendId = conversation.members.find((m) => m !== currentUser._id);
        const getUser = async () => {
            try {
                const res = await axios.get("https://we-meet-9jye.onrender.com/api/users?userId=" + friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentUser, conversation]);

    if (!user) return null;

    const isOnline = onlineUsers.includes(user._id);

    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="relative shrink-0">
                <img
                    className="w-11 h-11 rounded-full object-cover"
                    src={user.profilePicture ? PF + user.profilePicture : PF + 'profile.jpg'}
                    alt={user.username}
                />
                {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900 truncate">{user.username}</span>
                <span className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                    {isOnline ? "Active now" : "Offline"}
                </span>
            </div>
        </div>
    );
}

export default Online;
