
import React, { useState, useEffect } from "react";
import "./diary.css";

const AIDiary = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(true);

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const storedMessages = JSON.parse(sessionStorage.getItem("diaryMessages"));
    if (storedMessages && storedMessages.length > 0) {
      setMessages(storedMessages);
      setHasSession(true);
      setAnimateBackground(false);
    }
  }, []);

  const handleSend = () => {
    if (input.trim() !== "") {
      const newMessage = { text: input, type: "user" }; // Mark as user input
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      sessionStorage.setItem("diaryMessages", JSON.stringify(newMessages));
      setInput("");

      if (!hasSession) {
        setHasSession(true);
        setAnimateBackground(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`diary-container ${hasSession ? "has-messages" : ""} ${animateBackground ? "animated-bg" : ""}`}>
      {/* Chat area (visible only after the first message is sent) */}
      {hasSession && (
        <div className="diary-chat">
          {messages.map((msg, index) => (
            <div key={index} className={`diary-message ${msg.type === "user" ? "user" : ""}`}>
              {msg.text}
            </div>
          ))}
        </div>
      )}

      {/* Input field with send button */}
      <div className={`diary-input-container ${hasSession ? "input-moved" : ""}`}>
        <textarea
          className="diary-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Write your thoughts here..."
        />
        <button className="diary-send-btn" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default AIDiary;
