import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Feed from "../Feed/Feed";
import ProfileRight from "./ProfileRight";
import axios from "axios";
import { useParams } from "react-router";
import { CameraAlt } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const [user, setUser] = useState({});
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const userName = useParams().username;
  const [profilePic, setProfilePic] = useState(null);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://we-meet-1-h00i.onrender.com/api/users?username=${userName}`
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userName, currentUser.profilePicture]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    const data = new FormData();
    data.append("file", file);

    try {
      const response = await axios.post("https://we-meet-1-h00i.onrender.com/api/upload", data);
      const imgPreview = response.data.filename;

      await axios.put(`https://we-meet-1-h00i.onrender.com/api/users/${user._id}`, {
        userId: currentUser._id,
        profilePicture: imgPreview,
      });

      setUser((prev) => ({ ...prev, profilePicture: imgPreview }));

      const updatedUser = { ...currentUser, profilePicture: imgPreview };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_PROFILE_PIC", payload: imgPreview });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-50">

      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col gap-10">
          {/* Cover */}
          <div className="relative w-full h-[260px]">
            <img
              src={user.coverPicture ? PF + user.coverPicture : PF + "3.jpeg"}
              alt="cover"
              className="w-full h-full object-cover rounded-b-2xl"
            />

            {/* Profile Pic */}
            <div className="absolute -bottom-15 left-14 flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "profile.jpg"
                  }
                  alt="profile"
                  className="w-36 h-36 rounded-full object-cover ring-4 ring-white shadow-lg"
                />

                {user._id === currentUser._id && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow">
                    <CameraAlt fontSize="small" />
                    <input
                      type="file"
                      hidden
                      accept=".png,.jpeg,.jpg"
                      onChange={handleChange}
                    />
                  </label>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.username}
                </h1>
              </div>
            </div>
          </div>


          {/* Content */}
          <div className="px-8 py-6 grid grid-cols-12 gap-16">
            {/* Feed */}
            <div className="col-span-12 lg:col-span-7">
              <Feed username={userName} />
            </div>

            {/* Right Panel */}
            {user._id && (
              <div className="hidden lg:block col-span-4 lg:col-span-5">
                <ProfileRight user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;