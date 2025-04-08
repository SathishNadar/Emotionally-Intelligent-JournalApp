import { useNavigate } from "react-router-dom";
import "./navbar.css";


function DashboardNavbar() {
  const navigate = useNavigate();

  return (
    <header className="dashboard-navbar">
      <h1>Logo</h1> 
      <nav>
        <button onClick={() => navigate("/dashboard")}>Home</button>
        <button onClick={() => navigate("/past")}>Past Entries</button>
        <button onClick={() => navigate("/uplifting-content")}>Uplifting Content</button>
        <button
        onClick={() => navigate("/spotifylogin")}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
        🎵 Spotify
      </button>
        <button
        onClick={() => navigate("/ai")}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
        🤖AI
      </button>
      </nav>
      <div className="profile">
        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>
    </header>
  );
}

export default DashboardNavbar;
