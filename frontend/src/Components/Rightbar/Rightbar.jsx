import React, { useState, useEffect } from 'react';
import './Rightbar.css'; 
import { Campaign, Message } from "@mui/icons-material"; // Added Message icon
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

function Rightbar({ user }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER; 
  const [friends, setFriends] = useState([]); 
  const navigate = useNavigate(); 
  

  // useEffect to fetch user's friends when component mounts or user ID changes
  useEffect(() => {
    const getFriends = async () => {
      if (!user._id) return; 
      try {
        // Fetch the friend list using user's ID
        const friendList = await axios.get(`http://localhost:8800/api/users/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.error("Error fetching friends:", err.response?.data || err.message);
      }
    };
    getFriends(); 
  }, [user._id]); 

  const handleStartChat = (friendId) => {
    console.log(`Starting chat with friend ID: ${friendId}`);
   
    alert("Chat function trigger for this friend!");
  };

  return (
    <div className='flex flex-col p-4 gap-6 sticky top-20 right-0 w-125 mt-2 h-fit'>
      
      {/* ========================================
        1. AD WIDGET (Compact and focused)
        ========================================
      */}
      <div className='flex flex-col gap-3 bg-white p-4 rounded-xl items-center justify-center shadow-sm border border-gray-100'>
        <div className='flex items-center text-sm text-gray-500 mb-3'>
          <Campaign className='!text-lg mr-1' />
          <span>Advertisement</span>
        </div>

        {/* Ad Image - Sized for a rightbar widget (smaller width) */}
        <img 
          className='rounded-lg w-[90%]  h-auto object-cover cursor-pointer' 
          src='assets/ad.png' 
          alt='Advertisement' 
        />
        <p className='text-xs text-gray-600 mt-2'>
          *A brief, compelling ad text goes here.*
        </p>
      </div>

      <hr className='border-t border-gray-200' />

      {/* ========================================
        2. ONLINE FRIENDS WIDGET (Actionable)
        ========================================
      */}
      <div className='flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>Online Friends</h3>
        
        {/* Container for friend cards */}
        <div className='flex flex-col gap-3'>
          {Array.isArray(friends) && friends.length > 0 ? (
            friends.map((friend) => (
              <div 
                key={friend._id} 
                className='flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors'
              >
                
                {/* Profile Link Area */}
                <div 
                  onClick={() => navigate("/profile/" + friend.username)} 
                  className='flex items-center gap-3 flex-grow cursor-pointer'
                >
                  
                  {/* Profile Picture (with a fake online badge for visual) */}
                  <div className='relative'>
                    <img
                      className='w-10 h-10 rounded-full object-cover'
                      src={friend.profilePicture ? PF + friend.profilePicture : PF + '1.jpeg'}
                      alt={friend.username}
                    />
                    {/* Placeholder for an online dot */}
                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></span>
                  </div>

                  {/* Username */}
                  <span className='text-sm font-medium text-gray-800 truncate'>
                    {friend.username}
                  </span>
                </div>

                {/* Quick Chat Button */}
                <button 
                  onClick={() => handleStartChat(friend._id)}
                  className='p-1 ml-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100 transition-colors'
                  title={`Message ${friend.username}`}
                >
                  <Message className='!text-xl' />
                </button>
              </div>
            ))
          ) : (
             <p className='text-sm text-gray-500'>No friends online (or no friends added).</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rightbar;