import React, { useContext, useState, useRef } from "react";
import { PhotoLibrary, LocationOn, EmojiEmotionsOutlined, Close } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

function Share() {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file && !desc.trim()) {
      toast.error("Please enter some content to post");
      return;
    }

    const newPost = { userId: user._id, desc };

    if (file) {
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await axios.post("https://we-meet-1-h00i.onrender.com/api/upload", data);
        newPost.img = res.data.filename;
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("https://we-meet-1-h00i.onrender.com/api/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setDesc((prev) => prev + ` https://www.google.com/maps?q=${latitude},${longitude}`);
    });
  };

  return (
    <div className="mt-6 mx-auto flex flex-col gap-5 w-full md:max-w-[720px] bg-white rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 px-5 py-4 font-app">

      {/* Input Row */}
      <div className="flex items-center gap-3">
        <img
          className="w-11 h-11 rounded-full object-cover ring-1 ring-black/5"
          src={user.profilePicture ? PF + user.profilePicture : PF + "profile.jpg"}
          alt="User"
        />

        <input
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 transition"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={`What's on your mind, ${user.username}?`}
        />
      </div>

      {/* Image Preview */}
      {file && (
        <div className="relative mt-4 rounded-2xl overflow-hidden group">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full max-h-[320px] object-cover rounded-2xl"
          />
          <button
            onClick={() => setFile(null)}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white rounded-full p-1 transition"
          >
            <Close fontSize="small" />
          </button>
        </div>
      )}

      {/* Actions */}
      <form onSubmit={submitHandler} className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">

          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer px-3 py-1.5 rounded-full hover:bg-gray-100 transition">
            <PhotoLibrary fontSize="small" />
            Media
            <input
              type="file"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleLocation}
            className="flex items-center gap-2 text-xs text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <LocationOn fontSize="small" />
            Location
          </button>

          <button
            type="button"
            onClick={() => setShowEmojiPicker((p) => !p)}
            className="flex items-center gap-2 text-xs text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <EmojiEmotionsOutlined fontSize="small" />
            Emoji
          </button>
        </div>

        <button
          type="submit"
          className="bg-black text-white text-sm px-5 cursor-pointer py-2 rounded-full hover:bg-gray-900 transition shadow-sm"
        >
          Post
        </button>
      </form>

      {/* Emoji Picker Floating Panel */}
      {showEmojiPicker && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] ring-1 ring-black/10 overflow-hidden">
            <EmojiPicker
              height={380}
              width={320}
              skinTonesDisabled
              searchDisabled={false}
              previewConfig={{ showPreview: false }}
              onEmojiClick={(e) => setDesc((prev) => prev + e.emoji)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Share;