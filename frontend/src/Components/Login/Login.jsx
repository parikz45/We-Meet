import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCalls } from "../../apicalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

function Login() {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCalls(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-8">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
            Social Media
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Speak. Create. Connect.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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

          {/* Error */}
          {error && (
            <div className="text-sm text-red-500 text-center mt-2">
              Wrong email or password
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={isFetching}
            className="mt-4 h-11 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isFetching ? (
              <CircularProgress color="inherit" size="20px" />
            ) : (
              "Log In"
            )}
          </button>

          {/* Forgot password */}
          <Link
            to="/resetPassword"
            className="text-sm text-blue-600 text-center hover:underline mt-2"
          >
            Forgot password?
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Sign up */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="h-11 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Create a new account
          </button>
        </form>
      </div>
    </div>
  );

}

export default Login;
