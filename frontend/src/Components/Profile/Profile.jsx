import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import Sidebar from '../Sidebar/Sidebar'
import Feed from '../Feed/Feed'
import Navbar from '../Navbar/Navbar'
import ProfileRight from './ProfileRight'
import axios from "axios";
import { useParams } from 'react-router'
import { CameraAlt } from '@mui/icons-material'
import { AuthContext } from '../../context/AuthContext'

function Profile() {
  const [user, setUser] = useState({});
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const userName = useParams().username;
  const [profilePic, setProfilePic] = useState(null);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  // Fetch user data based on the username in the URL
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://we-meet-mecf4.sevalla.app//api/users?username=${userName}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userName, currentUser.profilePicture]); // Re-fetch user when username or profile picture changes

  // Handle profile picture upload and update
  const handleChange = async (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    const data = new FormData();
    data.append("file", file);

    try {
      // Upload the file to server
      const response = await axios.post("https://we-meet-mecf4.sevalla.app//api/upload", data);
      const imgPreview = response.data.filename;

      // Update the user's profile picture in the database
      await axios.put(`https://we-meet-mecf4.sevalla.app//api/users/${user._id}`, {
        userId: currentUser._id,
        profilePicture: imgPreview,
      });

      // Update the local user state
      setUser(prev => ({ ...prev, profilePicture: imgPreview }));

      // Update the current user in localStorage and context
      const updatedUser = {
        ...currentUser,
        profilePicture: imgPreview,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_PROFILE_PIC", payload: imgPreview });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {/* Top navbar */}
      <Navbar />

      {/* Main container */}
      <div className='home-container'>
        <Sidebar /> {/* Sidebar navigation */}

        {/* Main content area */}
        <div className='profile-mid-top'>
          <div className='profile-container'>

            {/* Cover photo */}
            <img
              className='cover-Img'
              src={user.coverPicture ? PF + user.coverPicture : PF + "3.jpeg"}
              alt="cover"
            />

            {/* Profile image and uploader */}
            <div className='profile-imgContainer'>
              <img
                className='profile-pic'
                src={user.profilePicture ? PF + user.profilePicture : PF + "profile.jpg"}
                alt="profile"
              />
              {/*camera icon, shown only if viewing own profile */}
              {user._id === currentUser._id && (
                <label className="upload-icon">
                  <CameraAlt style={{ color: 'white', fontSize: '20px' }} className='upload-icon' />
                  <input
                    style={{ display: 'none' }}
                    type='file'
                    accept='.png,.jpeg,.jpg'
                    onChange={handleChange}
                  />
                </label>
              )}
            </div>

            <span className='profile-Name'>{userName}</span>
          </div>

          {/* Bottom section with Feed and ProfileRight components */}
          <div className='profile-mid-bottom'>
            <div className='feed'>
              <Feed username={userName} />
            </div>

            {/* Right section with user details */}
            {user._id && (
              <div className='ProfileRight'>
                <ProfileRight user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
