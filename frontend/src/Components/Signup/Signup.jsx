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
        toast.success("Registration successful!");
        navigate("/details");
      } catch (err) {
        console.log(err);
        toast.error("Registration failed!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">

      <div className="w-full max-w-md bg-white rounded-3xl 
                    shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]
                    ring-1 ring-black/5
                    px-10 py-10
                    flex flex-col gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            We-Meet
          </h1>
          <p className="text-sm text-neutral-500">
            Speak. Create. Connect.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleClick} className="flex flex-col gap-6">

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">
              Username
            </label>
            <input
              required
              ref={username}
              placeholder="yourusername"
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm
                       focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">
              Email address
            </label>
            <input
              type="email"
              required
              ref={email}
              placeholder="you@example.com"
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm
                       focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">
              Password
            </label>
            <input
              type="password"
              required
              ref={password}
              minLength="6"
              placeholder="••••••••"
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm
                       focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">
              Confirm password
            </label>
            <input
              type="password"
              required
              ref={passwordAgain}
              minLength="6"
              placeholder="••••••••"
              className="h-11 px-4 rounded-xl border border-neutral-300 text-sm
                       focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Primary Button */}
          <button
            type="submit"
            className="h-11 rounded-xl bg-black text-white text-sm font-medium
                     hover:bg-neutral-800 transition cursor-pointer"
          >
            Sign up
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-300" />
            <span className="text-xs text-neutral-400">OR</span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>

          {/* Secondary Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="h-11 rounded-xl border border-black text-black text-sm font-medium
                     hover:bg-black hover:text-white transition cursor-pointer"
          >
            Log in to account
          </button>

        </form>
      </div>
    </div>
  );

}

export default Signup;
