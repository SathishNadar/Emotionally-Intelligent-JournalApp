import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect user to main page after Spotify authentication
    navigate("/spotify");
  }, []);

  return <div>Redirecting...</div>;
}

export default SpotifyCallback;