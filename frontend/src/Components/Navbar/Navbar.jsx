import React, { useContext, useState, useEffect, useRef } from 'react';
import { Search, Person, Notifications, Chat } from "@mui/icons-material";
import './Navbar.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [logout, setLogout] = useState(false);
  const moreRef = useRef();
  const { dispatch } = useContext(AuthContext);
  const [notifications, setNotifications] = useState("");
  const [searchquery, setSearchquery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [checkLogout, setCheckLogout] = useState(false);
  const [checkRemoveDp, setCheckRemoveDp] = useState(false);

  // hide logout dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (moreRef.current && !moreRef.current.contains(event.target)) {
      setLogout(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // toggle logout options dropdown
  const logoutBar = () => {
    setLogout((prev) => !prev);
  }

  // log the user out
  const Logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }

  // fetch all users for search functionality
  useEffect(() => {
    const findAllUsers = async () => {
      try {
        const res = await axios.get("https://we-meet-9jye.onrender.com//api/users/all");
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    findAllUsers();
  }, []);

  // filter users based on search query
  const findPeople = (query) => {
    const filtered = allUsers.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // remove user's profile picture
  const removeDp = async () => {
    try {
      const res = await axios.put(`https://we-meet-9jye.onrender.com//api/users/${user._id}`, {
        userId: user._id,
        profilePicture: ""
      });

      // update localStorage and context
      const updatedUser = {
        ...user,
        profilePicture: "",
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_PROFILE_PIC", payload: "" });

      setCheckRemoveDp(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='navbar-container'>
      <div className='navbar-left'>
        {/* logo / home navigation */}
        <span onClick={() => navigate('/')} className='logo'>Social Media</span>
      </div>

      <div className='navbar-center'>
        {/* search bar */}
        <div className='searchbar'>
          <Search className='search-icon' />
          <input
            value={searchquery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchquery(val);
              findPeople(val);
            }}
            placeholder='Search for a friend'
            className='searchfield'
          />
        </div>
      </div>

      <div className='navbar-right'>
        {/* links */}
        <div className='navbar-links'>
          <span onClick={() => navigate('/profile/' + user.username)} className='navbarlink'>Homepage</span>
          <span onClick={() => navigate("/chat")} className='navbarlink'>Chats</span>
        </div>

        {/* icon section */}
        <div className='navbar-icons'>
          <div className='icon-items'>
            <Person />
            {notifications && <span className='iconitems-badge'>{notifications}</span>}
          </div>
          <div onClick={() => navigate("/chat")} className='icon-items'>
            <Chat />
          </div>
          <div className='icon-items'>
            <Notifications />
          </div>
        </div>

        {/* user profile + dropdown menu */}
        <div ref={moreRef}>
          <img
            onClick={logoutBar}
            className='profile-Image'
            src={user.profilePicture ? PF + user.profilePicture : PF + 'profile.jpg'}
          />
          <div className={`logout ${logout ? "visible" : ""}`}>
            <span onClick={() => setCheckLogout(true)} className="logout-span">🔒 Log out</span>
            <span onClick={() => navigate("/details")} className="logout-span">📝 Update personal details</span>
            <span onClick={() => setCheckRemoveDp(true)} className="logout-span">🖼️ Remove profile picture</span>
          </div>
        </div>
      </div>

      {/* search results */}
      {searchquery && filteredUsers.length > 0 && (
        <div className="search-results">
          {filteredUsers.map((filteredUser) => (
            <div
              key={filteredUser._id}
              className="search-result-item"
              onClick={() => navigate(`/profile/${filteredUser.username}`)}
            >
              {filteredUser.username}
            </div>
          ))}
        </div>
      )}

      {/* logout confirmation dialog */}
      {checkLogout &&
        <div className='logout-overlay'>
          <div className="logout-div">
            <span style={{fontWeight:"500"}}>Are you sure you want to Log out ?</span>
            <div className="logoutButtons">
              <button className="logout-cancel" onClick={() => setCheckLogout(false)}>Cancel</button>
              <button className="logout-confirm" onClick={Logout}>Log out</button>
            </div>
          </div>
        </div>
      }

      {/* remove profile picture confirmation dialog */}
      {checkRemoveDp &&
        <div className='logout-overlay'>
          <div className="logout-div">
            <span style={{ fontWeight: "500" }}>Are you sure you want to remove your profile picture?</span>
            <div className="logoutButtons">
              <button className="logout-cancel" onClick={() => setCheckRemoveDp(false)}>Cancel</button>
              <button className="logout-confirm" onClick={removeDp}>Remove</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Navbar;