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
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">

      <div className="w-full max-w-md flex flex-col gap-10 bg-white rounded-3xl shadow-[0_25px_70px_-20px_rgba(0,0,0,0.25)] px-10 py-10">

        {/* Title */}
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Tell us more about yourself
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            This helps personalize your experience
          </p>
        </div>

        <div className="space-y-6 flex flex-col gap-4">

          {/* State */}
          <div className="flex flex-col gap-3">
            <label className="text-sm text-neutral-600">
              Which state are you from?
            </label>
            <input
              defaultValue={User.state || ""}
              onChange={(e) => setCurrentState(e.target.value)}
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm 
                       focus:outline-none focus:border-black transition"
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-3">
            <label className="text-sm text-neutral-600">
              Which city are you from?
            </label>
            <input
              defaultValue={User.city || ""}
              onChange={(e) => setCity(e.target.value)}
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm 
                       focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Relationship */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">
              Relationship status
            </label>
            <select
              defaultValue={User.relationship || ""}
              onChange={(e) => setRelation(e.target.value)}
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm 
                       focus:outline-none focus:border-black transition cursor-pointer"
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-neutral-500 hover:text-black transition"
          >
            Skip
          </button>

          <button
            onClick={handleSubmit}
            className="h-11 px-8 rounded-xl bg-black text-white text-sm font-medium cursor-pointer
                     hover:bg-neutral-800 transition"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

export default Details;
