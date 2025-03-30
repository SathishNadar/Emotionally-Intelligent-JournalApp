import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/login.jsx';
import Signup from './pages/Login/signup.jsx';
import Home from './pages/Home/home.jsx';
import Dashboard from './pages/Dashboard/dashboard.jsx';
import Spotify from './pages/spotify.jsx';
import SpotifyLogin from './pages/spotifyLogin.jsx';
import SpotifyCallback from './pages/spotifyCallback.jsx';

function App() {
  // 🔄 Function to refresh the Spotify token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return;

    try {
      const response = await fetch("http://localhost:7777/refresh_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_expires_in", Date.now() + data.expires_in * 1000);
        console.log("🔄 Access token refreshed:", data.access_token);
      }
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
    }
  };

  // 🕒 Runs on every page load & refreshes token every 55 minutes
  useEffect(() => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return; // Don't run if user isn't logged into Spotify
    
    refreshAccessToken(); // Refresh on initial load

    const interval = setInterval(() => {
      const expiryTime = localStorage.getItem("spotify_expires_in");
      if (expiryTime && Date.now() >= expiryTime) {
        refreshAccessToken();
      }
    }, 55 * 60 * 1000); // Refresh every 55 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Dashboard />} /> // badlna hai baadme 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spotifylogin" element={<SpotifyLogin />} /> 
        <Route path="/callback" element={<SpotifyCallback />} /> 
        <Route path="/spotify" element={<Spotify />} />
      </Routes>
    </div>
  );
}

export default App;