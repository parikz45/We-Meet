import React, { useRef } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();

  // Refs for form inputs
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  // Handles user signup and password confirmation
  const handleClick = async (e) => {
    e.preventDefault();

    // Clear any existing custom validation messages
    passwordAgain.current.setCustomValidity("");

    // Check if passwords match
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("The passwords do not match");
    } else {
      // Create user object
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        // Send POST request to register user
        const res = await axios.post("https://we-meet-9jye.onrender.com//api/auth/register", user);

        // Save user to localStorage and navigate to details page
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/details");

      } catch (err) {
        console.log(err);
        alert("Cannot sign up user!");
      }
    }
  };

  return (
    <div className='Signup-page'>
      {/* Left side text section */}
      <div className='page-Text'>
        <span className='page-name'>Social Media</span>
        <span className='page-description'>Speak, Create, Connect</span>
      </div>

      {/* Signup form */}
      <form onSubmit={handleClick} className='signup-box'>

        {/* Username input */}
        <input
          className='Email'
          required
          ref={username}
          placeholder='Username'
        />

        {/* Email input */}
        <input
          className='Email'
          type='email'
          required
          ref={email}
          placeholder='Email'
        />

        {/* Password input */}
        <input
          className='password'
          type='password'
          required
          ref={password}
          minLength="6"
          placeholder='Password'
        />

        {/* Confirm password input */}
        <input
          className='password'
          type='password'
          required
          ref={passwordAgain}
          minLength="6"
          placeholder='Re-enter Password'
        />

        {/* Sign up button */}
        <button type='submit' className='button-Signup'>
          Sign up
        </button>

        {/* Navigate to login page */}
        <button
          type='button'
          onClick={() => navigate('/login')}
          className='button-Login'
        >
          Log in to account
        </button>
      </form>
    </div>
  );
}

export default Signup;
