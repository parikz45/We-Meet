import React, { useContext, useEffect, useState } from "react";
import Share from "../Share/Share";
import Post from "../Post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Feed({ username }) {
  const [posts, setPost] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeleteFromState = (postId) => {
    setPost((prev) => prev.filter((p) => p._id !== postId));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = username
          ? await axios.get("https://we-meet-9jye.onrender.com/api/posts/profile/" + username)
          : await axios.get("https://we-meet-9jye.onrender.com/api/posts/timeline/" + user._id);

        setPost(
          response.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );

        if (Array.isArray(response.data)) {
          setPost(response.data);
        } else {
          console.error("Response is not an array:", response.data);
          setPost([]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPost([]);
      }
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="flex-1 min-w-0 flex flex-col">

      {/* Share + Posts */}
      <div className="flex flex-col gap-5">
        {(!username || user.username === username) && <Share />}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} onDelete={handleDeleteFromState} />
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
        {["About", "Help", "Terms", "Privacy"].map((item) => (
          <button
            key={item}
            onClick={() => navigate(`/${item.toLowerCase()}`)}
            className="text-xs text-gray-400 hover:text-indigo-500 transition"
          >
            {item}
          </button>
        ))}
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">© 2025 We-Meet</span>
      </footer>

    </div>
  );
}

export default Feed;