import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCalls } from "../../apicalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  }, [error]);


  const handleSubmit = (e) => {
    e.preventDefault();
    loginCalls(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    if (!isFetching && !error) {
      // success case: user is set in context
      toast.success("Logged in successfully!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">

      <div className="w-full max-w-md bg-white rounded-3xl 
                    shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] 
                    ring-1 ring-black/5
                    px-10 py-10 
                    flex flex-col gap-8">

        {/* Brand Section */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Social Media
          </h1>
          <p className="text-sm text-neutral-500">
            Speak. Create. Connect.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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

          {/* Primary Button */}
          <button
            type="submit"
            disabled={isFetching}
            className="h-11 rounded-xl bg-black text-white text-sm font-medium
                     hover:bg-neutral-800 transition
                     disabled:opacity-60
                     flex items-center justify-center cursor-pointer"
          >
            {isFetching ? (
              <CircularProgress color="inherit" size="20px" />
            ) : (
              "Log In"
            )}
          </button>

          {/* Forgot Password */}
          <Link
            to="/forgotPassword"
            className="text-sm text-neutral-500 text-center hover:text-black transition"
          >
            Forgot password?
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-300" />
            <span className="text-xs text-neutral-400">OR</span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>

          {/* Secondary Button */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="h-11 rounded-xl border border-black text-black text-sm font-medium
                     hover:bg-black hover:text-white transition cursor-pointer"
          >
            Create a new account
          </button>

        </form>
      </div>
    </div>
  );

}

export default Login;
