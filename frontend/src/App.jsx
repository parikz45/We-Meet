import { useContext } from 'react'
import './App.css'
import Feed from './Components/Feed/Feed';
import Sidebar from './Components/Sidebar/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Profile from './Components/Profile/Profile';
import { AuthContext } from './context/AuthContext';
import Messenger from './Components/Messenger/Messenger';
import Details from './Components/Details/Details';
import Notfound from './Components/Notfound/Notfound';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Privacy from './Components/Privacy/Privacy';
import About from './Components/About/About';
import Terms from './Components/Terms/Terms';
import Help from './Components/Help/Help';
import Navbar from './Components/Navbar/Navbar';

function Home() {
  const { user } = useContext(AuthContext);
  const isMobile = window.innerWidth <= 768;
 
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <div className="max-w-6xl mx-auto flex gap-6 px-4 py-6">
        {!isMobile && <Sidebar />}
        <Feed />
      </div>
    </div>
  );
}

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={user ? <Home /> : <Login />} />
          <Route path='/login' element={user ? <Navigate to="/" /> : <Login />} />
          <Route path='/signup' element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path='/profile/:username' element={user ? <Profile /> : <Login />} />
          <Route path='/chat' element={user ? <Messenger /> : <Login />} />
          <Route path='/details' element={<Details />} />
          {/* <Route path='/forgotPassword' element={<ForgotPassword />} /> */}
          {/* <Route path='/resetPassword/:token' element={<ResetPassword />} /> */}
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/about' element={<About />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/help' element={<Help />} />
          <Route path='*' element={<Notfound />} />
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
  );
}

export default App;