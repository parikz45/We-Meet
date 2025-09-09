import React, { useState, useEffect } from 'react';
import './Rightbar.css'; 
import { Campaign } from "@mui/icons-material"; 
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
        const friendList = await axios.get(`https://we-meet-mecf4.sevalla.app/api/users/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.error("Error fetching friends:", err.response?.data || err.message);
      }
    };
    getFriends(); 
  }, [user._id]); 

  return (
    <div className='rightbar'>
      
      {/* Top section containing the ad/campaign icon */}
      <div className='right-top'>
        <Campaign />
        <span className='birthday'>Ad</span>
      </div>

      {/* Advertisement image */}
      <div>
        <img className='right-img' src='assets/ad.png' />
      </div>

      {/* Bottom section: List of online friends */}
      <div className='right-bottom'>
        <span className='bottom-head'>Online friends</span>

        {/* Container for friend cards */}
        <div className='user-pics'>
          {Array.isArray(friends) && friends.map((friend) => (
            <div className='row1' key={friend._id}>

              {/* Navigate to friend's profile when clicked */}
              <div onClick={() => navigate("/profile/" + friend.username)} className='set'>

                {/* Display profile picture */}
                <img
                  className='friend-image'
                  src={friend.profilePicture ? PF + friend.profilePicture : PF + '1.jpeg'}
                />

                {/* Display friend's username */}
                <span className='friend-name'>{friend.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Rightbar; 
