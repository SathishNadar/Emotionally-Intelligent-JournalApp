import React from "react";
import { useNavigate } from "react-router-dom";
import "./otherFeatures.css";
import DashboardNavbar from "../Navbar/Navbar";
import Footers from "../footer/footers";

function OtherFeatures() {
  const navigate = useNavigate();

  return (
    <>
    <DashboardNavbar/>
    <div className="features-container">
      {/* Section 1: Pomodoro Timer */}
      <div className="feature-section" id="pomodoro-timer">
        <h2>🕒 Pomodoro Timer</h2>
        <p>Stay focused with 25-minute work sessions and 5-minute breaks!</p>
        {/* Placeholder - Replace with actual Pomodoro timer component */}
        <button>Start Timer</button>
      </div>

      {/* Section 2: To-Do Task List */}
      <div className="feature-section" id="todo-list">
        <h2>📝 To-Do List</h2>
        <p>Add your tasks and check them off as you complete them.</p>
        {/* Placeholder - Replace with actual To-Do component */}
        <ul>
          <li><input type="checkbox" /> Sample Task 1</li>
          <li><input type="checkbox" /> Sample Task 2</li>
        </ul>
        <input type="text" placeholder="Add a task..." />
        <button>Add Task</button>
      </div>

      {/* Section 3: Spotify Integration */}
      <div className="feature-section" id="spotify-integration">
        <h2>🎧 Spotify</h2>
        <p>Login to enjoy music that fits your mood!</p>
        <button onClick={() => navigate("/spotify")}>Open Spotify</button>
      </div>

      {/* Section 4: AI Chatbot */}
      <div className="feature-section" id="ai-chatbot">
        <h2>🤖 AI Chatbot</h2>
        <p>Talk with your intelligent AI companion.</p>
        <button onClick={() => navigate("/ai")}>Go to AI Chat</button>
      </div>
    </div>
    <Footers/>
    </>
  );
}

export default OtherFeatures;