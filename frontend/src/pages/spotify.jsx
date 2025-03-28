import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Spotify = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:7777/me", { credentials: "include" });

        if (response.status === 401) {
          window.location.href = `https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:5173/callback&scope=user-read-private%20user-read-email%20user-top-read%20user-read-recently-played%20user-library-read%20playlist-read-private`;
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("❌ Authentication failed:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      {error ? <h1>{error}</h1> : user ? <h1>Welcome, {user.display_name}!</h1> : <h1>Loading...</h1>}
    </div>
  );
};

export default Spotify;