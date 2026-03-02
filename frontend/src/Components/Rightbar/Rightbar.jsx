import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Rightbar({ user }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getFriends = async () => {
      if (!user?._id) return;
      try {
        const friendList = await axios.get(
          `https://we-meet-1-h00i.onrender.com/api/users/friends/${user._id}`
        );
        setFriends(friendList.data || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    getFriends();
  }, [user?._id]);

  return (
    <aside className="w-[420px] h-[calc(100vh-20px)] sticky top-3 bg-white rounded-3xl shadow-sm px-5 py-5 flex flex-col justify-between font-[Inter,system-ui,sans-serif]">

      {/* Top Content */}
      <div className="space-y-6 gap-4">
        {/* Advertisement */}
        <div className="group cursor-pointer flex flex-col gap-4 pt-5">
          <span className="text-xs text-gray-400">Advertisement</span>
          <div className="mt-2 rounded-2xl overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5">
            <img
              className="w-full object-cover"
              src="/assets/ad.png"
              alt="Ad"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Who to follow */}
        <div className="pt-5 flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-800 mb-2 tracking-wide">
            Who to follow
          </h3>

          {friends.length > 0 ? (
            <div className="flex flex-col gap-3">
              {friends.slice(0, 3).map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between group"
                >
                  {/* Left: Avatar + Name */}
                  <div
                    onClick={() => navigate("/profile/" + friend.username)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      className="w-13 h-13 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                      src={
                        friend.profilePicture
                          ? PF + friend.profilePicture
                          : PF + "1.jpeg"
                      }
                      alt={friend.username}
                    />

                    <div className="flex flex-col gap-[5px] leading-tight">
                      <span className="text-[16px] font-semibold text-gray-900 tracking-tight">
                        {friend.username}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Suggested for you
                      </span>
                    </div>
                  </div>

                  {/* Right: Follow Button */}
                  <button
                    className="
              px-4 py-1.5 text-[12px] font-medium rounded-full bg-gray-900 text-white
              border border-gray-200 
              hover:bg-white hover:cursor-pointer hover:text-gray-800 hover:border-gray-900
              transition-all duration-200
            "
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No suggestions right now.</p>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
          <span onClick={()=>{navigate('/about')}} className="hover:text-gray-600 cursor-pointer transition">About</span>
          <span onClick={()=>{navigate('/help')}} className="hover:text-gray-600 cursor-pointer transition">Help</span>
          <span onClick={()=>{navigate('/terms')}} className="hover:text-gray-600 cursor-pointer transition">Terms</span>
          <span onClick={()=>{navigate('/privacy')}} className="hover:text-gray-600 cursor-pointer transition">Privacy</span>
        </div>
      </div>
    </aside>
  );
}

export default Rightbar;
