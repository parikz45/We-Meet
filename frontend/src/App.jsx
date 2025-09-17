import { useContext, useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
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

function Home() {
  const { user } = useContext(AuthContext);
  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      <Navbar />
      <div className="flex gap-4 mt-4 px-2">
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
    <Router>
      <Routes>
        < Route path='/' element={user ? <Home /> : <Login />}></Route>
        <Route path='/login' element={user ? <Navigate to="/" /> : <Login />} ></Route>
        <Route path='/signup' element={user ? <Navigate to="/" /> : <Signup />} ></Route>
        <Route path='/profile/:username' element={user ? <Profile /> : <Login />}></Route>
        <Route path='/chat' element={user ? <Messenger /> : <Login />}></Route>
        <Route path='/details' element={<Details />}></Route>
        <Route path='/resetPassword' element={<ForgotPassword />}></Route>
        <Route path='*' element={<Notfound />}></Route>
      </Routes>
    </Router>
  )
}

export default App
