import { useNavigate } from "react-router-dom";
import "./navbar.css";


function DashboardNavbar() {
  const navigate = useNavigate();

  return (
    <header className="dashboard-navbar">
      <h1>Logo</h1> 
      <nav>
        <button onClick={() => navigate("/dashboard")}>Home</button>
        <button onClick={() => navigate("/past-entries")}>Past Entries</button>
        <button onClick={() => navigate("/uplifting-content")}>Uplifting Content</button>
      </nav>
      <div className="profile">
        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>
    </header>
  );
}

export default DashboardNavbar;
