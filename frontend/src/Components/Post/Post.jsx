import React, { useContext, useEffect, useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";

function Post({ post }) {
  const navigate = useNavigate();
  const [like, setLike] = useState(post.likes?.length ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [showdelete, setShowdelete] = useState(false);
  const [checkDelete, setCheckDelete] = useState(false);
  const [fullScreenImg, setFullScreenImg] = useState(false);

  // Like handler
  const likeHandler = () => {
    try {
      axios.put(`http://localhost:8800/api/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setLike((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?userId=${post.userId}`
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [post.userId, currentUser]);

  const handleDelete = () => {
    try {
      axios.delete(`http://localhost:8800/api/posts/${post._id}`, {
        data: { userId: currentUser._id },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const setDelete = () => {
    setShowdelete((prev) => !prev);
  };

  return (
    <div
      className="mt-6 mx-auto w-full md:max-w-[590px] rounded-lg shadow-lg p-4 sm:p-6 bg-white"
      key={post._id}
    >
      {/* Top section with profile image, username, timestamp, and options */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-4">
          <img
            onClick={() => navigate(`/profile/${user.username}`)}
            className="w-12 h-12 rounded-full object-cover border-2 border-transparent transition-transform duration-200 hover:scale-105 cursor-pointer"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "profile.jpg"
            }
            alt="Profile"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 transition-colors hover:text-blue-600 cursor-pointer">
              {user.username}
            </span>
            <span className="text-sm text-gray-500">
              {format(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="relative">
          {user.username === currentUser.username && (
            <button
              onClick={() => setCheckDelete(true)}
              className="text-red-500 cursor-pointer hover:text-red-700 font-semibold text-sm px-2 py-1 border border-red-500 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Caption */}
        <span className="block text-base">{post.desc}</span>

        {/* Post image */}
        {post.img && (
          <img
            className="w-full object-cover mx-auto mt-4 cursor-pointer rounded-md"
            src={PF + post.img}
            onClick={() => setFullScreenImg(true)}
          />
        )}
      </div>

      {/* Bottom */}
      <div className="flex items-center pt-5 gap-2">
        <img
          onClick={likeHandler}
          className="w-6 mr-2 cursor-pointer"
          src={PF + "like.png"}
        />
        <img
          onClick={likeHandler}
          className="w-6 mr-2 cursor-pointer"
          src={PF + "heart.png"}
        />
        <span className="text-sm">{like} people liked</span>
        <span className="ml-auto mr-6 text-sm text-red-600">
          {post.comment} comments
        </span>
      </div>

      {/* Delete confirmation modal */}
      {checkDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-5 shadow-lg space-y-4 max-w-sm">
            <span className="font-normal text-[18px]">
              Are you sure you want to delete this post?
            </span>
            <div className="flex justify-center gap-4 space-x-3">
              <button
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setCheckDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image overlay */}
      {fullScreenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 p-4"
          onClick={() => setFullScreenImg(false)}
        >
          <img
            className="max-w-full max-h-[90%] rounded-lg animate-zoomIn"
            src={PF + post.img}
            alt="full"
          />
        </div>
      )}
    </div>
  );
}

export default Post;