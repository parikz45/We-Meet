import React, { useContext, useEffect, useState } from 'react';
import './ProfileRight.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@mui/icons-material';

function ProfileRight({ user }) {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [following, setFollowing] = useState(
    currentUser.followings.includes(user._id)
  );

  // Fetch friends of the profile user whenever the user ID changes
  useEffect(() => {
    const getFriends = async () => {
      if (!user._id) return; 
      try {
        const friendList = await axios.get(`https://we-meet-production.up.railway.app/api/users/friends/${user._id}`);
        setFriends(friendList.data);  
      } catch (err) {
        console.error("Error fetching friends:", err.response?.data || err.message);
      }
    };
    getFriends();
  }, [user._id]);

  // Function to follow/unfollow the user
  const handleClick = async () => {
    try {
      if (following) {
        // Unfollow user
        await axios.put(`https://we-meet-production.up.railway.app/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        // Follow user
        await axios.put(`https://we-meet-production.up.railway.app/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowing(!following);  
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* follow/unfollow button, visible only if the current user is viewing someone else's profile */}
      {user.username !== currentUser.username && (
        <button className='follow-button' onClick={handleClick}>
          {following ? "Unfollow" : "Follow"}
          {following ? null : <Add />}
        </button>
      )}

      {/* Main right section of the profile page */}
      <div className='profile-right'>

        {/* User information section */}
        <div className='user-info'>
          <span className='title'>User information</span>

          <div className='info'>
            <span className='option'>state:</span>
            <span className='value'>{user.state}</span>
          </div>

          <div className='info'>
            <span className='option'>city:</span>
            <span className='value'>{user.city}</span>
          </div>

          <div className='info'>
            <span className='option'>Relationship:</span>
            <span className='value'>{user.relationship}</span>
          </div>
        </div>

        {/* User friends list section */}
        <div className='user-pics'>
          <span className='Title2'>User friends</span>

          {/* Mapping through friends array and displaying each friend */}
          {Array.isArray(friends) && friends.map((friend) => (
            <div className='row1' key={friend._id}>
              <div onClick={() => navigate("/profile/" + friend.username)} className='set'>
                <img
                  className='friend-image'
                  src={friend.profilePicture ? PF + friend.profilePicture : PF + '1.jpeg'}
                  alt='friend'
                />
                <span className='friend-name'>{friend.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProfileRight;