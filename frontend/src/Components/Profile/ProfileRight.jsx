import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Edit } from "@mui/icons-material";

const API = "https://we-meet-9jye.onrender.com";

function ProfileRight({ user }) {
  const navigate = useNavigate();
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${API}/api/users/friends/${user._id}`);
        setFriends(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    getFriends();
  }, [user?._id]);

  return (
    <aside className="flex flex-col gap-6">
      {/* PERSONAL INFO CARD */}
      <div className="bg-white flex flex-col gap-4 rounded-2xl border border-gray-200/80 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Personal Information
          </h3>

          {user._id === currentUser._id && (
            <button
              onClick={() => navigate("/details")}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition"
            >
              <Edit fontSize="small" />
              Edit
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 text-[15px]">
          <InfoRow label="State" value={user.state} />
          <InfoRow label="City" value={user.city} />
          <InfoRow label="Relationship" value={user.relationship} />
        </div>
      </div>

      {/* FRIENDS CARD */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm px-6 py-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Friends</h3>

        {friends.length > 0 ? (
          <div className="flex flex-col gap-4">
            {friends.slice(0, 5).map((friend) => (
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
                    className="w-11 h-11 rounded-full object-cover group-hover:scale-105 transition"
                  />
                  <span className="text-[15px] font-semibold text-gray-900">
                    {friend.username}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/profile/" + friend.username)}
                  className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
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

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value || "—"}</span>
    </div>
  );
}

export default ProfileRight;
