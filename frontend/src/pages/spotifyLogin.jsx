import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    console.log("🔍 Stored Token:", token);
    
    if (token) {
      navigate("/spotify");
    }
  }, []);

  const handleLogin = () => {  
    console.log("🟢 Login button clicked, redirecting to /login");
    window.location.href = "http://localhost:7777/login"; // Redirect user to Spotify login
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login to Spotify</h1>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "18px" }}>
        Login with Spotify
      </button>
    </div>
  );
};

export default SpotifyLogin;

