import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const handleClick = async (e) => {
    e.preventDefault();

    if (password.current.value !== passwordAgain.current.value) {
      toast.error("Passwords do not match");
      return;
    }

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
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-8">
      <div className="w-full max-w-[420px] flex flex-col gap-8">

        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">We-Meet</h1>
          <p className="text-sm text-gray-500 mt-1">Speak. Create. Connect.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 px-8 py-8 flex flex-col gap-5">

          <h2 className="text-base font-semibold text-gray-800">Create your account</h2>

          <form onSubmit={handleClick} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Username</label>
              <input
                required
                ref={username}
                placeholder="yourusername"
                className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                           focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</label>
              <input
                type="email"
                required
                ref={email}
                placeholder="you@example.com"
                className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                           focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Password row — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  required
                  ref={password}
                  minLength="6"
                  placeholder="••••••••"
                  className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                             focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Confirm</label>
                <input
                  type="password"
                  required
                  ref={passwordAgain}
                  minLength="6"
                  placeholder="••••••••"
                  className="h-10 px-3.5 rounded-lg border border-gray-200 text-sm bg-gray-50
                             focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 h-10 rounded-lg bg-indigo-600 text-white text-sm font-medium
                         hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              Create account
            </button>

          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="h-10 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium
                       hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Sign in to existing account
          </button>

        </div>

      </div>
    </div>
  );
}

export default Signup;