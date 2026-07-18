import React, { useContext, useState } from "react";
import { PhotoLibrary, LocationOn, EmojiEmotionsOutlined, Close } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { media } from "../../utils/media";

function Share() {
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
        const res = await axios.post("https://we-meet-9jye.onrender.com/api/upload", data);
        newPost.img = res.data.filename;
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("https://we-meet-9jye.onrender.com/api/posts", newPost);
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
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">

      {/* Top: avatar + textarea */}
      <div className="flex gap-3 px-5 pt-5 pb-3">
        <img
          className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100 shrink-0 mt-0.5"
          src={user.profilePicture ? media(user.profilePicture) : media("profile.jpg")}
          alt="User"
        />
        <textarea
          rows={2}
          className="flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none
                     placeholder:text-gray-400 leading-relaxed"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={`What's on your mind, ${user.username}?`}
        />
      </div>

      {/* Image Preview */}
      {file && (
        <div className="relative mx-5 mb-3 rounded-xl overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full max-h-[260px] object-cover rounded-xl"
          />
          <button
            onClick={() => setFile(null)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white rounded-full p-1 transition"
          >
            <Close fontSize="small" />
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-5" />

      {/* Bottom: actions + post button */}
      <form onSubmit={submitHandler} className="flex items-center justify-between px-4 py-3">

        <div className="flex items-center gap-0.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 cursor-pointer
                            px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition">
            <PhotoLibrary sx={{ fontSize: 17 }} />
            Photo
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
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500
                       px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <LocationOn sx={{ fontSize: 17 }} />
            Location
          </button>

          <button
            type="button"
            onClick={() => setShowEmojiPicker((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500
                       px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <EmojiEmotionsOutlined sx={{ fontSize: 17 }} />
            Emoji
          </button>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg
                     hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          Post
        </button>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-1 ring-black/10 overflow-hidden">
            <EmojiPicker
              height={380}
              width={320}
              skinTonesDisabled
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