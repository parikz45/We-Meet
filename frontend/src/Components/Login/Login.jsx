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
    <div className="flex flex-col items-center gap-[40px] bg-gray-50 pt-10 min-h-screen">
      {/* Title and tagline */}
      <div className="flex flex-col gap-[5px] items-center">
        <span className="text-[50px] font-bold text-blue-600">Social Media</span>
        <span className="text-[25px] text-center text-gray-700">
          Speak, Create, Connect
        </span>
      </div>

      {/* Login box */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[20px] items-center bg-white pt-[40px] lg:pt-[60px] w-[370px] lg:w-[400px] h-[340px] lg:h-[400px] rounded-lg shadow-[0_7px_29px_1px_rgba(100,100,111,0.3)]"
      >
        {/* Email */}
        <input
          type="email"
          required
          ref={email}
          placeholder="Email"
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] rounded-md border-2 border-gray-400 px-3 focus:outline-none"
        />

        {/* Password */}
        <input
          type="password"
          required
          ref={password}
          minLength="6"
          placeholder="Password"
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] rounded-md border-2 border-gray-400 px-3 focus:outline-none"
        />

        {/* Login button */}
        <button
          type="submit"
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] bg-blue-600 text-white rounded-lg text-[15px] cursor-pointer mt-[5px] hover:bg-blue-700 transition"
        >
          {isFetching ? (
            <CircularProgress color="inherit" size="20px" />
          ) : (
            "Log In"
          )}
        </button>

        {/* Create account button */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition"
        >
          Create a new account
        </button>

        {/* Forgot password */}
        <Link
          to="/resetPassword"
          className="mt-[20px] text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>

        {/* Error */}
        {error && (
          <div className="mt-[25px] text-red-500">
            <span>Wrong username/password</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
