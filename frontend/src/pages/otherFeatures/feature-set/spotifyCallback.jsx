import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("🔹 Sending code to backend:", code);

      // Send the code to backend for token exchange
      fetch(`http://localhost:7777/callback?code=${code}`)
        .then(response => response.json()) // Expecting JSON from backend
        .then(data => {
          console.log("✅ Backend response:", data);

          if (data.access_token) {
            // Store tokens for later use
            localStorage.setItem("spotify_access_token", data.access_token);
            localStorage.setItem("spotify_refresh_token", data.refresh_token);
            localStorage.setItem("spotify_expires_in", Date.now() + data.expires_in * 1000);
            
            // Redirect user to main Spotify page
            navigate("/home");
          } else {
            console.error("❌ No access token received.");
            navigate("/spotifylogin"); // Redirect back to login if auth fails
          }
        })
        .catch(error => {
          console.error("❌ Callback Error:", error);
          navigate("/dashboard");
        });
    } else {
      console.error("❌ No authorization code found in URL.");
      navigate("/spotifylogin");
    }
  }, [navigate]);

  return <div>Processing Spotify Login...</div>;
}

export default SpotifyCallback;