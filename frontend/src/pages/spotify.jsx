import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Spotify = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:7777/me", { credentials: "include" });
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("❌ Authentication failed:", error);
        navigate("/spotifyLogin"); // Redirect if not logged in
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      {user ? <h1>Welcome, {user.display_name}!</h1> : <h1>Loading...</h1>}
    </div>
  );
};

export default Spotify;