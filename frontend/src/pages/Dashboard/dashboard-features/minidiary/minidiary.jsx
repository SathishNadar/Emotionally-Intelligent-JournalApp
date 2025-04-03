import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./minidiary.css";

const MiniDiary = () => {
  const [entry, setEntry] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (entry.trim() !== "") {
      sessionStorage.setItem("draftEntry", entry);
      navigate("/diary");
    }
  };

  const handleTryDiary = () => {
    navigate("/diary");
  };

  useEffect(() => {
    const bubbleContainer = document.querySelector(".bubble-container");

    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");

      const size = Math.random() * 40 + 10; 
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}vw`; 
      bubble.style.animationDuration = `${Math.random() * 3 + 4}s`; 

      bubbleContainer.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 7000); 
    };

    const interval = setInterval(createBubble, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mini-diary-container">
      {/* Floating bubbles container */}
      <div className="bubble-container"></div>

      <h2 className="mini-diary-title">Your Thoughts</h2>
      <textarea
        className="mini-diary-textarea"
        placeholder= "Write Your Thoughts..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <div className="button-container">
        <button className="mini-diary-button" onClick={handleSubmit}>
          Send
        </button>
        <button className="mini-diary-button" onClick={handleTryDiary}>
          Try Diary
        </button>
      </div>
    </div>
  );
};

export default MiniDiary;
