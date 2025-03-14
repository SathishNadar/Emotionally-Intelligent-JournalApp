import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Dashboard</h1>

      <button
        onClick={() => navigate("/diary")}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        📖 Diary
      </button>

      <button
        onClick={() => navigate("/spotifylogin")}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        🎵 Spotify
      </button>

      <button
        onClick={() => navigate("/chatbot")}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        🤖 Chatbot
      </button>
    </div>
  );
};

export default Dashboard;