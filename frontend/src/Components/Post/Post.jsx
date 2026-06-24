import React, { useContext, useEffect, useState } from "react";
import { DeleteOutlineRounded, FavoriteBorder, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import ConfirmDialog from "../ConfirmDialogue/confirmDialogue";
import ImageViewer from "../ImageViewer/imageviewer";
import { toast } from "react-toastify";

function Post({ post, onDelete }) {
  const navigate = useNavigate();
  const [like, setLike] = useState(post.likes?.length ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [checkDelete, setCheckDelete] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const likeHandler = () => {
    axios.put(`https://we-meet-9jye.onrender.com/api/posts/${post._id}/like`, {
      userId: currentUser._id,
    });
    setLike((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    axios
      .get(`https://we-meet-9jye.onrender.com/api/users?userId=${post.userId}`)
      .then((res) => setUser(res.data));
  }, [post.userId]);

  const getProfileSrc = (pic) => {
    if (!pic) return PF + "profile.jpg";
    if (pic.startsWith("http")) return pic;
    return PF + pic;
  };

  const getPostImgSrc = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return PF + img;
  };

  const hasImage = !!post.img;

  const handleDelete = async () => {
    try {
      await axios.delete(`https://we-meet-9jye.onrender.com/api/posts/${post._id}`, {
        data: { userId: currentUser._id },
      });
      toast.success("Post deleted successfully!");
      onDelete(post._id);
    } catch (err) {
      console.log(err);
      toast.error("Error!! Failed to delete post!");
    }
  };

  return (
    <article className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm px-5 py-5">

      {checkDelete && (
        <ConfirmDialog
          open={checkDelete}
          title="Delete post?"
          description="This post will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          danger
          onCancel={() => setCheckDelete(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            onClick={() => navigate(`/profile/${user.username}`)}
            className="w-10 h-10 rounded-full object-cover cursor-pointer ring-2 ring-indigo-100"
            src={getProfileSrc(user.profilePicture)}
          />
          <div>
            <p
              onClick={() => navigate(`/profile/${user.username}`)}
              className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition"
            >
              {user.username}
            </p>
            <p className="text-xs text-gray-400">{format(post.createdAt)}</p>
          </div>
        </div>

        {user.username === currentUser.username && (
          <button
            onClick={() => setCheckDelete(true)}
            className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg cursor-pointer hover:bg-red-50 transition"
          >
            <DeleteOutlineRounded fontSize="small" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className={`flex flex-col ${hasImage ? "gap-4" : "gap-3"}`}>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">{post.desc}</p>

        {/* Image */}
        {hasImage && (
          <div
            onClick={() => setViewerOpen(true)}
            className="relative h-[220px] rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              src={getPostImgSrc(post.img)}
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>
        )}

        {/* Like */}
        <div className="pt-1 border-t border-gray-50 flex items-center">
          <button
            onClick={likeHandler}
            className={`flex items-center gap-1.5 text-sm transition px-2 py-1 rounded-lg
              ${isLiked
                ? "text-rose-500"
                : "text-gray-400 hover:text-rose-400 hover:bg-rose-50"
              }`}
          >
            {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            <span className="font-medium">{like}</span>
          </button>
        </div>
      </div>

      {viewerOpen && (
        <ImageViewer
          open={viewerOpen}
          src={getPostImgSrc(post.img)}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </article>
  );
}

export default Post;