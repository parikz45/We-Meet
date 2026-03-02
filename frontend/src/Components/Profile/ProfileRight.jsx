import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Edit, PersonAddAlt1, Check } from "@mui/icons-material";

function ProfileRight({ user }) {
  const navigate = useNavigate();
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [following, setFollowing] = useState(
    currentUser.followings.includes(user._id)
  );

  // Fetch friends
  useEffect(() => {
    const getFriends = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `https://we-meet-1-h00i.onrender.com/api/users/friends/${user._id}`
        );
        setFriends(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    getFriends();
  }, [user?._id]);


  // Follow / Unfollow
  const handleFollow = async () => {
    try {
      if (following) {
        await axios.put(
          `https://we-meet-1-h00i.onrender.com/api/users/${user._id}/unfollow`,
          { userId: currentUser._id }
        );
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(
          `https://we-meet-1-h00i.onrender.com/api/users/${user._id}/follow`,
          { userId: currentUser._id }
        );
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowing(!following);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className="space-y-6 flex flex-col gap-4">

      {/* FOLLOW BUTTON (only if not own profile) */}
      {user._id !== currentUser._id && (
        <button
          onClick={handleFollow}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition
            ${following
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
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

      {/* PERSONAL INFO CARD */}
      <div className="bg-white flex flex-col gap-3 rounded-2xl border border-gray-100 shadow-sm px-8 py-6">

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>

          {user._id === currentUser._id && (
            <button
              onClick={() => navigate("/details")}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition"
            >
              <Edit fontSize="small" />
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4 text-[15px]">
          <div className="flex justify-between">
            <span className="text-gray-500">State</span>
            <span className="text-gray-900 font-medium">
              {user.state || "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">City</span>
            <span className="text-gray-900 font-medium">
              {user.city || "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Relationship</span>
            <span className="text-gray-900 font-medium">
              {user.relationship || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* FRIENDS CARD */}
      <div className="bg-white rounded-2xl border flex flex-col gap-3 border-gray-100 shadow-sm px-6 py-6">

        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Friends
        </h3>

        {friends.length > 0 ? (
          <div className="flex flex-col gap-4">
            {friends.slice(0, 3).map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between group"
              >
                <div
                  onClick={() => navigate("/profile/" + friend.username)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={
                      friend.profilePicture
                        ? PF + friend.profilePicture
                        : PF + "profile.jpg"
                    }
                    alt={friend.username}
                    className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition"
                  />

                  <span className="text-[15px] font-semibold text-gray-900">
                    {friend.username}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/profile/" + friend.username)}
                  className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No friends to display.</p>
        )}
      </div>

    </aside>
  );
}

export default ProfileRight;