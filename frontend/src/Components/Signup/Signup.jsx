import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const handleClick = async (e) => {
    e.preventDefault();
    passwordAgain.current.setCustomValidity("");

    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("The passwords do not match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        const res = await axios.post(
          "https://we-meet-1-h00i.onrender.com/api/auth/register",
          user
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/details");
      } catch (err) {
        console.log(err);
        alert("Cannot sign up user!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-8">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
            We-Meet
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Speak. Create. Connect.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleClick} className="flex flex-col gap-4">

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Username</label>
            <input
              required
              ref={username}
              placeholder="yourusername"
              className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email address</label>
            <input
              type="email"
              required
              ref={email}
              placeholder="you@example.com"
              className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              required
              ref={password}
              minLength="6"
              placeholder="••••••••"
              className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Confirm password</label>
            <input
              type="password"
              required
              ref={passwordAgain}
              minLength="6"
              placeholder="••••••••"
              className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="mt-4 h-11 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign up
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="h-11 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Log in to account
          </button>
        </form>
      </div>
    </div>
  );

}

export default Signup;
