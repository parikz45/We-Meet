import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [searchquery, setSearchquery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const findAllUsers = async () => {
      try {
        const res = await axios.get("https://we-meet-1-h00i.onrender.com/api/users/all");
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    findAllUsers();
  }, []);

  const findPeople = (query) => {
    if (!query.trim()) { setFilteredUsers([]); return; }
    const filtered = allUsers.filter((u) =>
      u.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelect = (username) => {
    navigate(`/profile/${username}`);
    setSearchquery("");
    setFilteredUsers([]);
  };

  return (
    <header className="w-full h-14 bg-white border-b border-gray-200/80 flex items-center px-6 gap-6 sticky top-0 z-40">

      {/* Logo */}
      <span
        onClick={() => navigate("/")}
        className="text-base font-semibold text-gray-900 cursor-pointer shrink-0 hover:text-indigo-600 transition"
      >
        We-Meet
      </span>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-9
                        focus-within:border-indigo-400 focus-within:ring-3 focus-within:ring-indigo-100 transition-all">
          <Search className="text-gray-400 shrink-0" fontSize="small" />
          <input
            value={searchquery}
            onChange={(e) => {
              setSearchquery(e.target.value);
              findPeople(e.target.value);
            }}
            placeholder="Search people..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
          {searchquery && (
            <button
              onClick={() => { setSearchquery(""); setFilteredUsers([]); }}
              className="text-gray-300 hover:text-gray-500 transition text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {filteredUsers.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => handleSelect(u.username)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                  {u.username[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{u.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </header>
  );
}

export default Navbar;