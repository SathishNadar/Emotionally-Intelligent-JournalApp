import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css";
import DashboardNavbar from "../Navbar/Navbar";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return; // Prevent multiple clicks

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:7777/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let decoder = new TextDecoder();
      let botMessage = { text: "", sender: "ai" };
      let updatedMessages = [...newMessages, botMessage];

      setMessages(updatedMessages);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botMessage.text += decoder.decode(value, { stream: true });
        setMessages([...updatedMessages]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Error getting response. Try again.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }

    setInput("");
  };

  return (
    <>
    <DashboardNavbar/>
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
          <button onClick={sendMessage} className="send-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Send"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chatbot;