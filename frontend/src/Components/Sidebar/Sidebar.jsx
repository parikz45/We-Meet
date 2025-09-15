import React, { useContext, createContext } from "react";
import {
  RssFeed,
  Chat,
  Groups,
  Bookmark,
  HelpOutline,
  Event,
  WorkOutline,
  School,
  PlayCircleFilledOutlined,
} from "@mui/icons-material";

const AuthContext = createContext();

function Sidebar() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    return null;
  }

  return (
    <div className="hidden md:block w-full md:w-1/4 h-[calc(100vh-80px)] sticky top-20 bg-white border-r border-gray-200 p-4 rounded-r-2xl shadow-lg transition-all duration-300">
      <div className=" space-y-2">
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <RssFeed className="text-xl mr-4 text-purple-600" />
          <span className="font-medium text-lg text-gray-800">Feed</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <Chat className="text-xl mr-4 text-blue-600" />
          <span className="font-medium text-lg text-gray-800">Chats</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <PlayCircleFilledOutlined className="text-xl mr-4 text-red-600" />
          <span className="font-medium text-lg text-gray-800">Videos</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <Bookmark className="text-xl mr-4 text-yellow-600" />
          <span className="font-medium text-lg text-gray-800">Bookmark</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <HelpOutline className="text-xl mr-4 text-green-600" />
          <span className="font-medium text-lg text-gray-800">Questions</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <Groups className="text-xl mr-4 text-teal-600" />
          <span className="font-medium text-lg text-gray-800">Groups</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <WorkOutline className="text-xl mr-4 text-orange-600" />
          <span className="font-medium text-lg text-gray-800">Jobs</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <Event className="text-xl mr-4 text-pink-600" />
          <span className="font-medium text-lg text-gray-800">Events</span>
        </div>
        <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <School className="text-xl mr-4 text-indigo-600" />
          <span className="font-medium text-lg text-gray-800">Courses</span>
        </div>
      </div>

      <hr className="my-4 h-px bg-gray-300" />
    </div>
  );
}

export default Sidebar;
