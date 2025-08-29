import React, { useContext, useEffect, useState } from "react";
import "./Feed.css";
import Share from "../Share/Share";
import Post from "../Post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Feed({ username }) {
  const [posts, setPost] = useState([]);
  const { user } = useContext(AuthContext)

  // fetching posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = username
          ? await axios.get("https://we-meet-mecf4.sevalla.app/api/posts/profile/" + username)
          : await axios.get("https://we-meet-mecf4.sevalla.app/api/posts/timeline/" + user._id);

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
    <div className="feed">
      <div className="feed-wrapper">
        {(!username || user.username===username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
