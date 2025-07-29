import React, { useContext, useEffect, useState } from "react";
import "./Post.css";
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

  // Handles like/unlike toggle and updates UI instantly
  const likeHandler = () => {
    try {
      axios.put(`http://localhost:8800/api/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }

    // Optimistically update like count and toggle state
    setLike((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  // Check if current user has already liked the post
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  // Fetch the post author's user data
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

  // Handle actual delete request
  const handleDelete = () => {
    try {
      axios.delete(`http://localhost:8800/api/posts/${post._id}`, {
        data: { userId: currentUser._id },
      });
      window.location.reload(); // Refresh after deletion
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle delete dropdown visibility
  const setDelete = () => {
    setShowdelete((prev) => !prev);
  };

  return (
    <div className="post" key={post._id}>
      {/* Top section with profile image, username, timestamp, and options */}
      <div className="post-top">
        <img
          onClick={() => navigate(`/profile/${user.username}`)}
          className="post-profileimg"
          src={
            user.profilePicture
              ? PF + user.profilePicture
              : PF + "profile.jpg"
          }
        />
        <span className="name">{user.username}</span>
        <span className="time">{format(post.createdAt)}</span>

        {/* Show delete option only for current user's post */}
        <div className="more-div">
          {user.username === currentUser.username && (
            <MoreVert onClick={setDelete} className="more-icon" />
          )}
          <div
            onClick={() => setCheckDelete(true)}
            className={`delete-post ${showdelete ? "visible" : ""}`}
          >
            <span className="delpost-span">Delete post</span>
          </div>
        </div>
      </div>

      {/* Post caption */}
      <span className="post-caption">{post.desc}</span>

      {/* Post image if present */}
      {post.img && (
        <img className="post-img" src={PF + post.img} onClick={() => setFullScreenImg(true)} />
      )}

      {/* Like buttons and comment count */}
      <div className="post-bottom">
        <img
          onClick={likeHandler}
          className="like"
          src={PF + "like.png"}
        />
        <img
          onClick={likeHandler}
          className="like"
          src={PF + "heart.png"}
        />
        <span className="likeCounter">{like} people liked</span>
        <span className="comments">{post.comment} comments</span>
      </div>

      {/* Delete post confirmation modal */}
      {checkDelete && (
        <div className="logout-overlay">
          <div className="logout-div">
            <span style={{ fontWeight: "400" }}>
              Are you sure you want to delete this post?
            </span>
            <div className="logoutButtons">
              <button
                className="logout-cancel"
                onClick={() => setCheckDelete(false)}
              >
                Cancel
              </button>
              <button className="logout-confirm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* post image in full screen */}
      {
        fullScreenImg &&
        (
          <div className="fullscreen-overlay" onClick={() => setFullScreenImg(false)}>
            <img className="fullscreen-image" src={PF + post.img} alt="full" />
          </div>
        )
      }
    </div>
  );
}

export default Post;