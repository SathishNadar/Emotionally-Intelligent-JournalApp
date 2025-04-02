import React, { useState } from "react";
import "./diary.css";

const AIDiary = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="diary-container">
      <div className="diary-chat">
        {messages.map((msg, index) => (
          <div key={index} className="diary-message">
            {msg}
          </div>
        ))}
      </div>
      <textarea
        className="diary-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleEnterPress}
        placeholder="Write your thoughts here..."
      />
    </div>
  );
};

export default AIDiary;
