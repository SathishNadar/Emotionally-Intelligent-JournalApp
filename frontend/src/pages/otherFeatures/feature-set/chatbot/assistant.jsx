import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

function Assistant() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRedirect = () => {
    navigate('/ai'); // Redirect to /ai route
  };

  return (
    <div className="assistant-container">
      <h2>Welcome to Your Friendly AI Chatbot</h2>
      <p>
        Our friendly AI chatbot is here to listen, chat, and help you vent out your thoughts. 
        Feel free to talk to it anytime!
      </p>
      <button onClick={handleRedirect} className="chatbot-button">
        Start Chatting
      </button>
    </div>
  );
}

export default Assistant;