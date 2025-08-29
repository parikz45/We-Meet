import React, { useContext, useRef, useState } from 'react';
import './Share.css';
import { PhotoLibrary, LocationOn, EmojiEmotionsOutlined, Label, Cancel } from "@mui/icons-material"
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import EmojiPicker from "emoji-picker-react";

function Share() {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState(""); // Post description
  const [file, setFile] = useState(null); // Selected image/video file
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Toggle emoji picker
  const [noContent, setNoContent] = useState(false); // Warning for empty post

  // Toggle emoji picker display
  const handleEmojiClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Create a new post
  const submitHandler = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc
    };

    if (!file && !desc) {
      setNoContent(true);
      return;
    }

    if (file) {
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await axios.post("https://we-meet-mecf4.sevalla.app/api/upload", data);
        newPost.img = res.data.filename;
        setNoContent(false);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("https://we-meet-mecf4.sevalla.app/api/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // Share current location via Google Maps link
  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser does not support geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setDesc(locationMessage);
        setNoContent(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Could not retrieve location");
      }
    );
  };

  return (
    <div className='sharebox'>
      <div className='profile'>
        <img
          className='profile-imge'
          src={user.profilePicture ? PF + user.profilePicture : PF + "profile.jpg"}
        />
        <input
          className='share-input'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={'What is in your mind ' + user.username + "?"}
        />
      </div>

      <hr />

      {/* Preview selected image */}
      {file && (
        <div className="shareImg-container">
          <img className="shareImg" src={URL.createObjectURL(file)} />
          <Cancel className="cancel-button" onClick={() => setFile(null)} />
        </div>
      )}

      <form className='share-options' onSubmit={submitHandler}>
        {/* File input */}
        <label htmlFor='file' className='share-buttons'>
          <PhotoLibrary style={{ color: "red" }} />
          <span className='button-name'>Photo or video</span>
          <input
            style={{ display: "none" }}
            id="file"
            type="file"
            accept='.png,.jpeg,.jpg'
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
        </label>

        {/* Tag button (placeholder only) */}
        <div className='share-buttons'>
          <Label style={{ color: "blue" }} />
          <span className='button-name'>Tag</span>
        </div>

        {/* Add current location */}
        <div onClick={handleLocation} className='share-buttons'>
          <LocationOn style={{ color: "green" }} />
          <span className='button-name'>Location</span>
        </div>

        {/* Toggle emoji picker */}
        <div onClick={handleEmojiClick} className='share-buttons'>
          <EmojiEmotionsOutlined style={{ color: "gray" }} />
          <span className='button-name'>Emoji</span>
        </div>

        {/* Submit post */}
        <button type="submit" className='share-button'>Share</button>
      </form>

      {/* Emoji picker UI */}
      {showEmojiPicker && (
        <div className="emojipicker">
          <EmojiPicker onEmojiClick={(e) => setDesc(prev => prev + e.emoji)} />
        </div>
      )}

      {/* Warning for empty post */}
      {noContent && (
        <div className='noPost'>
          <span style={{ color: "gray", fontSize: "14px" }}>
            Enter something to post
          </span>
        </div>
      )}
    </div>
  );
}

export default Share;
