import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);

    try {
      const res = await axios.post("http://localhost:7777/api/chat", { query: input });
      setMessages([...newMessages, { text: res.data.response, sender: "ai" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput(""); // Clear input field
  };

  return (
    <div className="chat-container">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        BUTTON
      </button>
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h3>Chat History</h3>
        {messages.map((msg, index) => (
          msg.sender === "user" && <p key={index}>{msg.text}</p>
        ))}
      </div>

      <div className="chat-area">
        <h2>CHAT BUDDY</h2>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <p key={index} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
              {msg.sender === "user" ? "You: " : "Bot: "} {msg.text}
            </p>
          ))}
        </div>
        <div className="chat-input">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button onClick={sendMessage} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;