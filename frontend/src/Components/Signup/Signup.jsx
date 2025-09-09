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
          "https://we-meet-mecf4.sevalla.app/api/auth/register",
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
    <div className="flex flex-col gap-[40px] items-center px-10 py-8">
      {/* Title */}
      <div className="flex flex-col gap-[5px] items-center">
        <span className="text-[50px] font-bold text-blue-600">We-Meet</span>
        <span className="text-[25px] text-center text-gray-700">
          Speak, Create, Connect
        </span>
      </div>

      {/* Signup form */}
      <form
        onSubmit={handleClick}
        className="flex flex-col items-center gap-[20px] bg-white mt-10 w-[370px] lg:w-[400px] h-[340px] lg:h-[400px] rounded-lg shadow-[0_7px_29px_1px_rgba(100,100,111,0.3)] px-3 py-10"
      >
        {/* Username */}
        <input
          required
          ref={username}
          placeholder="Username"
          className="mb-5 w-[310px] lg:w-[340px] h-[45px] lg:h-[40px]rounded-md border-2 border-gray-400 px-3 focus:outline-none"
        />

        {/* Email */}
        <input
          type="email"
          required
          ref={email}
          placeholder="Email"
          className="mb-5 w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] rounded-md border-2 border-gray-400 px-3 focus:outline-none"
        />

        {/* Password */}
        <input
          type="password"
          required
          ref={password}
          minLength="6"
          placeholder="Password"
          className="mb-5 w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] rounded-md border-2 border-gray-400 px-3 focus:outline-none"
        />

        {/* Confirm password */}
        <input
          type="password"
          required
          ref={passwordAgain}
          minLength="6"
          placeholder="Re-enter Password"
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] rounded-md border-2 border-gray-400 px-3 focus:outline-none"
        />

        {/* Signup button */}
        <button
          type="submit"
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] bg-blue-600 text-white rounded-lg text-[15px] hover:bg-blue-700 transition"
        >
          Sign up
        </button>

        {/* Login button */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-[310px] lg:w-[340px] h-[45px] lg:h-[40px] bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Log in to account
        </button>
      </form>
    </div>
  );
}

export default Signup;
