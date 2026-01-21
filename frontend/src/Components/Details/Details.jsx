import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Details() {
  const User = JSON.parse(localStorage.getItem("user"));
  const [currentState, setCurrentState] = useState("");
  const [city, setCity] = useState("");
  const [relation, setRelation] = useState("");
  const navigate = useNavigate();

  // submitting user details
  const handleSubmit = async () => {
    try {
      await axios.put(`https://we-meet-1-h00i.onrender.com/api/users/${User._id}`, {
        userId: User._id,
        state: currentState || User.state || "",
        city: city || User.city || "",
        relationship: relation || User.relationship || ""
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("localStorage.getItem('user') =", User);
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-[30px] w-[370px] lg:w-[420px] gap-[25px] flex flex-col">
        
        {/* title */}
        <span className="text-blue-600 text-3xl font-bold mb-6 text-center">
          Tell us more about yourself
        </span>

        {/* state */}
        <div className="flex flex-col gap-[10px]">
          <span className="text-sm text-gray-700">Which state are you from?</span>
          <input
            defaultValue={User.state || ""}
            onChange={(e) => setCurrentState(e.target.value)}
            className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* city */}
        <div className="flex flex-col gap-[10px] ">
          <span className="text-sm text-gray-700">Which city are you from?</span>
          <input
            defaultValue={User.city || ""}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* relationship */}
        <div className="flex flex-col gap-[10px]">
          <span className="text-sm text-gray-700">Relationship status</span>
          <select
            defaultValue={User.relationship || ""}
            onChange={(e) => setRelation(e.target.value)}
            className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </div>

        {/* actions */}
        <div className="flex justify-between items-center">
          <a href="/" className="text-gray-500 text-sm hover:underline">
            Skip
          </a>
          <button
            onClick={handleSubmit}
            className="h-9 w-32 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Details;
