import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, send them to /spotify instead of showing login
    if (localStorage.getItem("spotify_access_token")) {
      navigate("/spotify");
    }
  }, []);

  const handleLogin = () => {  
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

