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
import { media } from "../../utils/media";

function Sidebar() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isMobile) return null;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const notify = () => toast("You have no new notifications!", { icon: "🔔" });
  const bookmark = () => toast("You have no saved posts!", { icon: "🔖" });

  return (
    <>
      <aside className="w-64 shrink-0 h-[calc(100vh-48px)] sticky top-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm px-3 py-4 flex flex-col justify-between">

        {/* Top */}
        <div className="flex flex-col gap-1">

          {/* Profile Card */}
          <div
            onClick={() => navigate(`/profile/${user.username}`)}
            className="rounded-xl px-3 py-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 transition mb-2"
          >
            <div className="relative">
              <img
                src={user.profilePicture ? media(user.profilePicture) : media("profile.jpg")}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500"
              />
            </div>
            <p className="text-base font-semibold text-gray-900">{user.username}</p>
            <span className="text-xs text-indigo-500 font-medium">View profile</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-2 mb-2" />

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem icon={<HomeOutlined />} label="Home" onClick={() => navigate("/")} />
            <SidebarItem icon={<NotificationsNoneOutlined />} label="Notifications" onClick={notify} />
            <SidebarItem icon={<ChatBubbleOutline />} label="Messages" onClick={() => navigate("/chat")} />
            <SidebarItem icon={<BookmarkBorder />} label="Bookmarks" onClick={bookmark} />
            <SidebarItem icon={<PersonOutline />} label="Profile" onClick={() => navigate(`/profile/${user.username}`)} />
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100 pt-2">
          <SidebarItem
            icon={<LogoutOutlined />}
            label="Logout"
            danger
            onClick={() => setShowLogoutConfirm(true)}
          />
        </div>

      </aside>

      {showLogoutConfirm && (
        <ConfirmDialog
          open={showLogoutConfirm}
          title="Logout"
          description="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
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
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"}
      `}
    >
      <span className="text-[20px] opacity-80">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default Sidebar;