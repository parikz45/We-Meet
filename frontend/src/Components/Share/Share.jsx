import React, { useContext, useState } from 'react';
import { PhotoLibrary, LocationOn, EmojiEmotionsOutlined, Cancel } from "@mui/icons-material"
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import EmojiPicker from "emoji-picker-react";

function Share() {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [noContent, setNoContent] = useState(false);

  const handleEmojiClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

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
    <div className="p-6 mt-6 max-w-2xl mx-auto rounded-3xl shadow-2xl bg-white transition-all duration-300">
      {/* Profile + input */}
      <div className="flex items-center gap-2 lg:gap-4 border-b border-gray-200 pb-4">
        <img
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-transparent"
          src={user.profilePicture ? PF + user.profilePicture : PF + "profile.jpg"}
          alt="User Profile"
        />
        <input
          className="flex-1 text-gray-800 outline-none placeholder-gray-400 text-base"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={`What's on your mind, ${user.username}?`}
        />
      </div>

      {/* Image preview */}
      {file && (
        <div className="relative my-6">
          <img className="w-full h-auto max-h-96 rounded-2xl object-cover shadow-inner" src={URL.createObjectURL(file)} alt="Preview" />
          <Cancel
            className="absolute top-4 right-4 cursor-pointer text-white bg-black/50 rounded-full text-3xl p-1 hover:bg-red-500 transition-colors"
            onClick={() => setFile(null)}
          />
        </div>
      )}

      {/* Share options */}
      <form className="flex flex-col sm:flex-row gap-4 sm:gap-7 pt-3" onSubmit={submitHandler}>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 flex-wrap mb-4 sm:mb-0">
          {/* File input */}
          <label htmlFor="file" className="flex items-center gap-2 text-sm lg:text-base cursor-pointer px-4 py-2 rounded-full hover:bg-red-50 transition-colors">
            <PhotoLibrary className="text-red-500" />
            <span className="text-gray-600 font-medium">Photo/Video</span>
            <input
              id="file"
              type="file"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {/* Location */}
          <div onClick={handleLocation} className="flex items-center gap-2 text-sm lg:text-base text-gray-600 cursor-pointer px-4 py-2 rounded-full hover:bg-green-50 transition-colors">
            <LocationOn className="text-green-500" />
            <span className="font-medium">Location</span>
          </div>

          {/* Emoji */}
          <div onClick={handleEmojiClick} className="flex items-center gap-2 text-sm lg:text-base text-gray-600 cursor-pointer px-4 py-2 rounded-full hover:bg-yellow-50 transition-colors">
            <EmojiEmotionsOutlined className="text-yellow-500" />
            <span className="font-medium">Emoji</span>
          </div>
        </div>

        {/* Share button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          Share
        </button>
      </form>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="mt-4 flex lg:justify-center">
          <EmojiPicker onEmojiClick={(e) => setDesc(prev => prev + e.emoji)} />
        </div>
      )}

      {/* Warning for empty post */}
      {noContent && (
        <div className="mt-4 text-center text-sm font-medium text-red-500 bg-red-50 px-4 py-2 rounded-lg">
          Enter something to post
        </div>
      )}
    </div>
  );
}

export default Share;