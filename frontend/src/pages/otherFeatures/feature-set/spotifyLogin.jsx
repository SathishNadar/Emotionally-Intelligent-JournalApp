import { useEffect } from "react";

const SpotifyLogin = () => {
  useEffect(() => {
    window.location.href = "http://localhost:7777/login";
  }, []);

  return <div>🔄 Redirecting to Spotify...</div>;
};

export default SpotifyLogin;