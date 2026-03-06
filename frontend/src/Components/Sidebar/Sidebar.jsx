import { useContext, useState } from "react";
import {
  HomeOutlined,
  NotificationsNoneOutlined,
  ChatBubbleOutline,
  BookmarkBorder,
  PersonOutline,
  LogoutOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import ConfirmDialog from "../ConfirmDialogue/confirmDialogue";

function Sidebar() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const isMobile = window.innerWidth <= 768;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isMobile) return null;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
    toast.success("Logged out successfully!", {
      icon: "👋",
    });
  };

  const notify = () =>
    toast("You have no new notifications!", {
      icon: "🔔",
    });

  const bookmark = () =>
    toast("You have no saved posts!", {
      icon: "🔖",
    });

  return (
    <>
      <aside className="w-72 h-[calc(100vh-24px)] sticky top-3 bg-white rounded-3xl shadow-sm px-4 py-3 flex flex-col justify-between font-[Inter,system-ui,sans-serif]">

        {/* Top */}
        <div>
          {/* Profile Card */}
          <div
            onClick={() => navigate(`/profile/${user.username}`)}
            className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 transition"
          >
            <img
              src={user.profilePicture ? PF + user.profilePicture : PF + "profile.jpg"}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
            />
            <p className="text-[24px] font-semibold text-gray-900">{user.username}</p>
            <span className="text-[12px] text-gray-500 tracking-wide">View profile</span>
          </div>

          {/* Navigation */}
          <nav className="mt-3 space-y-0.5">
            <SidebarItem icon={<HomeOutlined />} label="Home" onClick={() => navigate("/")} />
            <SidebarItem icon={<NotificationsNoneOutlined />} label="Notifications" onClick={notify} />
            <SidebarItem icon={<ChatBubbleOutline />} label="Messages" onClick={() => navigate("/chat")} />
            <SidebarItem icon={<BookmarkBorder />} label="Bookmarks" onClick={bookmark} />
            <SidebarItem icon={<PersonOutline />} label="Profile" onClick={() => navigate(`/profile/${user.username}`)} />
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-2 border-t border-gray-200">
          <SidebarItem
            icon={<LogoutOutlined />}
            label="Logout"
            danger
            onClick={() => setShowLogoutConfirm(true)}
          />
        </div>

      </aside>
      {/* Logout Confirmation Dialogue */}
      {
        showLogoutConfirm && (
          <ConfirmDialog
            open={showLogoutConfirm}
            title="Logout"
            description="Are you sure you want to logout?"
            confirmText="Logout"
            cancelText="Cancel"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )
      }
    </>
  );
}

function SidebarItem({ icon, label, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition
        ${danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-600 hover:bg-gray-100"}
      `}
    >
      <span className={`text-[21px] ${danger ? "opacity-100" : "opacity-70"}`}>
        {icon}
      </span>
      <span className={`text-[16px] py-[5px] font-semibold tracking-wide ${danger ? "font-medium" : ""}`}>
        {label}
      </span>
    </div>
  );
}

export default Sidebar;
