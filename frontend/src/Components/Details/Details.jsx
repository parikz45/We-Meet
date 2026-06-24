import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Details() {
  const User = JSON.parse(localStorage.getItem("user"));
  const [currentState, setCurrentState] = useState("");
  const [city, setCity] = useState("");
  const [relation, setRelation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.put(`https://we-meet-9jye.onrender.com/api/users/${User._id}`, {
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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4">
      <div className="w-full max-w-[420px] flex flex-col gap-8">

        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">One last step</h1>
          <p className="text-sm text-gray-500 mt-1">Help us personalize your experience</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 px-8 py-8 flex flex-col gap-5">

          <h2 className="text-base font-semibold text-gray-800">About you</h2>

          <div className="flex flex-col gap-4">

            {/* State + City side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">State</label>
                <input
                  defaultValue={User.state || ""}
                  onChange={(e) => setCurrentState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                             focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">City</label>
                <input
                  defaultValue={User.city || ""}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai"
                  className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                             focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {/* Relationship */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Relationship status</label>
              <select
                defaultValue={User.relationship || ""}
                onChange={(e) => setRelation(e.target.value)}
                className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                           focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              >
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>

          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-gray-700 transition"
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-6 rounded-lg bg-indigo-600 text-white text-sm font-medium
                         hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              Save & continue
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Details;