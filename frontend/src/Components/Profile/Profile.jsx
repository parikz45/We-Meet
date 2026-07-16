import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Feed from "../Feed/Feed";
import ProfileRight from "./ProfileRight";
import axios from "axios";
import { useParams } from "react-router";
import { CameraAlt, Edit, PersonAddAlt1, Check, LocationOnOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API = "https://we-meet-1-h00i.onrender.com";

function Profile() {
  const [user, setUser] = useState({});
  const [postCount, setPostCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const userName = useParams().username;
  const navigate = useNavigate();
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const isOwnProfile = user._id && user._id === currentUser._id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
<<<<<<< HEAD
        const res = await axios.get(`${API}/api/users?username=${userName}`);
=======
        const res = await axios.get(
          `https://we-meet-9jye.onrender.com/api/users?username=${userName}`
        );
>>>>>>> upstream/main
        setUser(res.data);
        setFollowing(currentUser.followings?.includes(res.data._id) || false);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userName, currentUser.followings]);

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const res = await axios.get(`${API}/api/posts/profile/${userName}`);
        setPostCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPostCount();
  }, [userName]);

  const uploadImage = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
<<<<<<< HEAD
      const response = await axios.post(`${API}/api/upload`, data);
      const filename = response.data.filename;

      await axios.put(`${API}/api/users/${user._id}`, {
=======
      const response = await axios.post("https://we-meet-9jye.onrender.com/api/upload", data);
      const imgPreview = response.data.filename;

      await axios.put(`https://we-meet-9jye.onrender.com/api/users/${user._id}`, {
>>>>>>> upstream/main
        userId: currentUser._id,
        [field]: filename,
      });

      setUser((prev) => ({ ...prev, [field]: filename }));

      if (field === "profilePicture") {
        const updatedUser = { ...currentUser, profilePicture: filename };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch({ type: "UPDATE_PROFILE_PIC", payload: filename });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async () => {
    try {
      const action = following ? "unfollow" : "follow";
      await axios.put(`${API}/api/users/${user._id}/${action}`, {
        userId: currentUser._id,
      });
      dispatch({ type: following ? "UNFOLLOW" : "FOLLOW", payload: user._id });
      setFollowing(!following);
      setUser((prev) => ({
        ...prev,
        followers: following
          ? prev.followers?.filter((id) => id !== currentUser._id)
          : [...(prev.followers || []), currentUser._id],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <div className="max-w-6xl mx-auto flex gap-6 px-4 py-6">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Profile header card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="relative h-44 sm:h-52 bg-gray-100">
              <img
                src={user.coverPicture ? PF + user.coverPicture : PF + "3.jpeg"}
                alt="cover"
                className="w-full h-full object-cover"
              />
              {isOwnProfile && (
                <label className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur hover:bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer shadow transition">
                  <CameraAlt fontSize="small" />
                  Edit cover
                  <input
                    type="file"
                    hidden
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => uploadImage(e, "coverPicture")}
                  />
                </label>
              )}
            </div>

            {/* Header body */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-end gap-4">
                  {/* Avatar */}
                  <div className="relative -mt-14 shrink-0">
                    <img
                      src={
                        user.profilePicture
                          ? PF + user.profilePicture
                          : PF + "profile.jpg"
                      }
                      alt="profile"
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md"
                    />
                    {isOwnProfile && (
                      <label className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full cursor-pointer shadow transition">
                        <CameraAlt fontSize="small" />
                        <input
                          type="file"
                          hidden
                          accept=".png,.jpeg,.jpg"
                          onChange={(e) => uploadImage(e, "profilePicture")}
                        />
                      </label>
                    )}
                  </div>

                  {/* Name + location */}
                  <div className="pb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.username}
                    </h1>
                    {(user.city || user.state) && (
                      <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <LocationOnOutlined fontSize="small" />
                        {[user.city, user.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="pb-1">
                  {isOwnProfile ? (
                    <button
                      onClick={() => navigate("/details")}
                      className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition"
                    >
                      <Edit fontSize="small" />
                      Edit profile
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition ${
                        following
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {following ? (
                        <>
                          <Check fontSize="small" />
                          Following
                        </>
                      ) : (
                        <>
                          <PersonAddAlt1 fontSize="small" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-5 pt-5 border-t border-gray-100">
                <Stat label="Posts" value={postCount} />
                <Stat label="Followers" value={user.followers?.length || 0} />
                <Stat label="Following" value={user.followings?.length || 0} />
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <Feed username={userName} />
            </div>

            {user._id && (
              <div className="hidden lg:block col-span-12 lg:col-span-5">
                <ProfileRight user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default Profile;
