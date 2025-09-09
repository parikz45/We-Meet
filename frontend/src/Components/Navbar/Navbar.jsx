import React, { useContext, useState, useEffect, useRef } from "react";
import { Search, Person, Notifications, Chat } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [logout, setLogout] = useState(false);
  const moreRef = useRef();
  const [searchquery, setSearchquery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [checkLogout, setCheckLogout] = useState(false);
  const [checkRemoveDp, setCheckRemoveDp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutBar = () => setLogout((prev) => !prev);

  const Logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  useEffect(() => {
    const findAllUsers = async () => {
      try {
        const res = await axios.get(
          "https://we-meet-mecf4.sevalla.app/api/users/all"
        );
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    findAllUsers();
  }, []);

  const findPeople = (query) => {
    const filtered = allUsers.filter((u) =>
      u.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const removeDp = async () => {
    try {
      const updatedUser = { ...user, profilePicture: "" };
      await axios.put(
        `https://we-meet-mecf4.sevalla.app/api/users/${user._id}`,
        {
          userId: user._id,
          profilePicture: "",
        }
      );
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_PROFILE_PIC", payload: "" });
      setCheckRemoveDp(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-[60px] bg-blue-600 flex items-center px-4 md:px-8 relative">
      {/* Left - Logo */}
      <div className="flex-3">
        <span
          onClick={() => navigate("/")}
          className="text-white font-bold text-xl cursor-pointer"
        >
          Social Media
        </span>
      </div>

      {isMobile ? (
        <>
          {/* Right - Mobile */}
          <div className="ml-auto flex items-center gap-4 text-white">
            <div onClick={() => setIsMobileSearchOpen(true)} className="cursor-pointer">
              <Search />
            </div>
            <div
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-[70px] right-4 bg-white shadow-lg rounded-lg flex flex-col gap-2 p-4 text-sm">
              <span
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer"
              >
                Homepage
              </span>
              <span
                onClick={() => {
                  navigate("/chat");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer"
              >
                Chats
              </span>
              <span
                onClick={() => {
                  setCheckLogout(true);
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer"
              >
                🔒 Log out
              </span>
              <span
                onClick={() => {
                  navigate("/details");
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer"
              >
                📝 Update details
              </span>
              <span
                onClick={() => {
                  setCheckRemoveDp(true);
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer"
              >
                🖼️ Remove DP
              </span>
            </div>
          )}

          {/* Mobile Search */}
          {isMobileSearchOpen && (
            <div className="fixed inset-0 bg-white flex flex-col z-50 p-4">
              <div className="flex items-center border rounded-full px-3 py-2 shadow">
                <Search className="text-gray-500" />
                <input
                  value={searchquery}
                  onChange={(e) => {
                    setSearchquery(e.target.value);
                    findPeople(e.target.value);
                  }}
                  placeholder="Search for a friend"
                  className="flex-1 outline-none px-2"
                  autoFocus
                />
                <CloseIcon
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    setSearchquery("");
                  }}
                  className="cursor-pointer text-gray-500"
                />
              </div>
              {searchquery && filteredUsers.length > 0 && (
                <div className="mt-3 bg-gray-100 rounded-lg shadow">
                  {filteredUsers.map((u) => (
                    <div
                      key={u._id}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        navigate(`/profile/${u.username}`);
                        setIsMobileSearchOpen(false);
                        setSearchquery("");
                      }}
                    >
                      {u.username}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Desktop Center - Search */}
          <div className="flex-5 px-4">
            <div className="bg-white h-9 rounded-full flex items-center px-3 shadow">
              <Search className="text-gray-500" />
              <input
                value={searchquery}
                onChange={(e) => {
                  setSearchquery(e.target.value);
                  findPeople(e.target.value);
                }}
                placeholder="Search for a friend"
                className="flex-1 outline-none px-2"
              />
            </div>
          </div>

          {/* Desktop Right */}
          <div className="flex-4 flex items-center justify-end gap-6 text-white">
            <div className="hidden md:flex gap-6">
              <span
                onClick={() => navigate(`/profile/${user.username}`)}
                className="cursor-pointer"
              >
                Homepage
              </span>
              <span
                onClick={() => navigate("/chat")}
                className="cursor-pointer"
              >
                Chats
              </span>
            </div>

            <div className="flex gap-4">
              <div onClick={() => navigate("/chat")} className="cursor-pointer">
                <Chat />
              </div>
              <div className="cursor-pointer">
                <Notifications />
              </div>
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={moreRef}>
              <img
                onClick={logoutBar}
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "profile.jpg"
                }
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                alt="Profile"
              />
              {logout && (
                <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg flex flex-col text-sm w-56">
                  <span
                    onClick={() => setCheckLogout(true)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    🔒 Log out
                  </span>
                  <span
                    onClick={() => navigate("/details")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    📝 Update personal details
                  </span>
                  <span
                    onClick={() => setCheckRemoveDp(true)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    🖼️ Remove profile picture
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Desktop Search Results */}
      {searchquery && filteredUsers.length > 0 && !isMobile && (
        <div className="absolute top-[60px] left-1/4 w-[600px] bg-white rounded-lg shadow max-h-72 overflow-y-auto z-50">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/profile/${u.username}`)}
            >
              {u.username}
            </div>
          ))}
        </div>
      )}

      {/* Logout Confirm */}
      {checkLogout && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <span className="font-semibold text-lg block mb-4">
              Are you sure you want to Log out?
            </span>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setCheckLogout(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={Logout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove DP Confirm */}
      {checkRemoveDp && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <span className="font-semibold text-lg block mb-4">
              Are you sure you want to remove your profile picture?
            </span>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setCheckRemoveDp(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={removeDp}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
