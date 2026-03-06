import { useContext, useState } from 'react'
import './App.css'
import Feed from './Components/Feed/Feed';
import Sidebar from './Components/Sidebar/Sidebar';
import Rightbar from './Components/Rightbar/Rightbar';
import { BrowserRouter as Router, Route, Routes, redirect, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Profile from './Components/Profile/Profile';
import { AuthContext } from './context/AuthContext';
import Messenger from './Components/Messenger/Messenger';
import Details from './Components/Details/Details';
import Notfound from './Components/Notfound/Notfound';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from './Components/ForgotPassword/resetPassword';
import Privacy from './Components/Privacy/Privacy';
import About from './Components/About/About';
import Terms from './Components/Terms/Terms';
import Help from './Components/Help/Help';

// homepage
function Home() {
  const { user } = useContext(AuthContext);
  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      <div className="flex gap-10 mt-4 px-2">
        {!isMobile && <Sidebar />}
        <Feed />
        {!isMobile && <Rightbar user={user} />}
      </div>

    </div>
  )
}
function App() {
  const { user } = useContext(AuthContext)
  return (
    <>
      <Router>
        <Routes>
          < Route path='/' element={user ? <Home /> : <Login />}></Route>
          <Route path='/login' element={user ? <Navigate to="/" /> : <Login />} ></Route>
          <Route path='/signup' element={user ? <Navigate to="/" /> : <Signup />} ></Route>
          <Route path='/profile/:username' element={user ? <Profile /> : <Login />}></Route>
          <Route path='/chat' element={user ? <Messenger /> : <Login />}></Route>
          <Route path='/details' element={<Details />}></Route>
          <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
          <Route path='/resetPassword/:token' element={<ResetPassword />}></Route>
          <Route path='/privacy' element={<Privacy />}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/terms' element={<Terms/>}></Route>
          <Route path='/help' element={<Help/>}></Route>
          <Route path='*' element={<Notfound />}></Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        theme="light"
        toastClassName="!bg-white !text-black !shadow-md !rounded-xl"
        bodyClassName="!text-sm !font-medium"
        progressClassName="!bg-gray-800"
      />
    </>
  )
}

export default App
