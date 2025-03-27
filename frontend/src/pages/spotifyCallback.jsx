import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("🔍 URL Params:", urlParams.toString()); // Debug log
  
    const accessToken = urlParams.get("access_token");
    const expiresIn = urlParams.get("expires_in");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_expires_in", Date.now() + expiresIn * 1000);

      console.log("✅ User logged in, tokens stored.");
      navigate("/spotify"); // Redirect the user to Spotify dashboard page
    } else {
      console.error("Missing tokens in URL");
      navigate("/dashboard");
    }
  }, []);

  // 🔄 Function to refresh token automatically
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
        console.log("✅ Access token refreshed:", data.access_token);
      }
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
    }
  };

  // 🔄 Automatically refresh token every 55 minutes
  const startTokenRefresh = () => {
    setInterval(async () => {
      const expiryTime = localStorage.getItem("spotify_expires_in");
      if (Date.now() >= expiryTime) {
        await refreshAccessToken();
      }
    }, 55 * 60 * 1000); // Refresh every 55 minutes
  };

  return <div>Processing authentication...</div>;
};

export default SpotifyCallback;