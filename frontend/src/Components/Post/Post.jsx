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
    axios.put(`https://we-meet-1-h00i.onrender.com/api/posts/${post._id}/like`, {
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
      .get(`https://we-meet-1-h00i.onrender.com/api/users?userId=${post.userId}`)
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
      await axios.delete(
        `https://we-meet-1-h00i.onrender.com/api/posts/${post._id}`,
        {
          data: { userId: currentUser._id },
        }
      );
      
      toast.success("Post deleted successfully!");
      onDelete(post._id);
    } catch (err) {
      console.log(err);
      toast.error("Error!! Failed to delete post!");
    }
  };

  return (
    <article className="mx-auto w-full flex flex-col gap-4 md:max-w-[720px] bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 px-5 py-5 mb-6 font-app">

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
            className="w-14 h-14 rounded-full object-cover cursor-pointer ring-1 ring-black/5"
            src={getProfileSrc(user.profilePicture)}
          />
          <div>
            <p className="text-md font-semibold text-gray-900 cursor-pointer hover:underline">
              {user.username}
            </p>
            <p className="text-xs text-gray-500">{format(post.createdAt)}</p>
          </div>
        </div>

        {user.username === currentUser.username && (
          <button
            onClick={() => setCheckDelete(true)}
            className="text-red-500 hover:text-red-600 p-1 rounded-full cursor-pointer hover:bg-red-50 transition"
          >
            <DeleteOutlineRounded fontSize="small" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-5 items-stretch">

        {/* Left */}
        <div
          className={`flex flex-col ${hasImage ? "justify-between min-h-[180px] md:min-h-[200px]" : "gap-5"
            }`}
        >
          {/* Description */}
          <p className="text-[15px] text-gray-800 leading-relaxed">
            {post.desc}
          </p>

          {/* Actions + Input */}
          <div className="mt-3">
            <div className="flex items-center gap-6 mb-2">
              <button
                onClick={likeHandler}
                className={`flex items-center gap-1 text-sm transition ${isLiked ? "text-rose-500" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                <span>{like}</span>
              </button>

            </div>
          </div>
        </div>

        {/* Right Image */}
        {hasImage && (
          <div
            onClick={() => setViewerOpen(true)}
            className="relative h-[180px] md:h-[200px] rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              src={getPostImgSrc(post.img)}
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>
        )}
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