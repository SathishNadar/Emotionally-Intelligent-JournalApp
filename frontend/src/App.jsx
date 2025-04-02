import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/login.jsx';
import Signup from './pages/Login/signup.jsx';
import Home from './pages/Home/home.jsx';
import Dashboard from './pages/Dashboard/dashboard.jsx';
import Spotify from './pages/spotify.jsx';
import SpotifyLogin from './pages/spotifyLogin.jsx';
import SpotifyCallback from './pages/spotifyCallback.jsx';
import Chatbot from './pages/Chatbot/chatbot.jsx'
import Diary from './pages/Diary/diary.jsx';
import "./index.css";


function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Dashboard />} /> // badlna hai baadme 
        <Route exact path="/home" element={<Home />} /> // badlna hai baadme 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spotifylogin" element={<SpotifyLogin />} /> 
        <Route path="/callback" element={<SpotifyCallback />} /> 
        <Route path="/spotify" element={<Spotify />} />
        <Route path="/ai" element={<Chatbot/>} />
        <Route path="/diary" element={<Diary/>} />
      </Routes>
    </div>
  );
}

export default App;