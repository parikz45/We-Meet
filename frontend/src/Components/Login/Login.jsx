import React, { useContext, useRef } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginCalls } from '../../apicalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';


function Login() {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault()
    loginCalls({ email: email.current.value, password: password.current.value }, dispatch);

  }

  return (
    <div className='signup-page'>

      {/* Title and tagline */}
      <div className='page-text'>
        <span className='page-name'>Social Media</span>
        <span className='page-description'>Speak, Create, Connect</span>
      </div>
      <form className='login-box' onSubmit={handleSubmit}>

        {/* email */}
        <input className='email' type='email' required ref={email} placeholder='Email' />

        {/* password */}
        <input className='pwd' type='password' required ref={password} minLength="6" placeholder='Password' />

        {/* login-button */}
        <button type='submit' className='button-signup'>{isFetching ? <CircularProgress color='inherit' size="20px" /> : "Log In"} </button>

        {/* navigate to signup */}
        <button onClick={() => navigate('/signup')} className='button-login'>Create a new account</button>

        {/* forgot password */}
        <Link className="forgot-pwd" to="/resetPassword" >Forgot password?</Link>

        {error && (
          <div className='login-failure'>
            <span>Wrong username/password</span>
          </div>
        )}
      </form>

    </div>
  )
}

export default Login
