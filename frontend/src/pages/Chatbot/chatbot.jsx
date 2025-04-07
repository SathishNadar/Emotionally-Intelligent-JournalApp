import React, { useState } from "react";
import "./chatbot.css";
import DashboardNavbar from "../Navbar/Navbar";
import Footers from "../footer/footers";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages); // Show user message immediately
    setInput(""); // Clear the input right away
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:7777/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      // Show bot message progressively
      setMessages((prev) => [...prev, { text: "", sender: "ai" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        botText += decoder.decode(value, { stream: true });

        // Update only the latest message (bot's)
        setMessages((prev) => {
          const temp = [...prev];
          temp[temp.length - 1] = { text: botText, sender: "ai" };
          return temp;
        });
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong!", sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="chatbot-page">
        <div className="chatbot-chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message ${
                msg.sender === "user" ? "user" : "bot"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chatbot-input-wrapper">
          <div className="chatbot-input-container">
            <textarea
              className="chatbot-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button
              onClick={sendMessage}
              className="chatbot-send-btn"
              disabled={isLoading}
            >
              {isLoading ? "..." : "➤"}
            </button>
          </div>
        </div>
      </div>
      <Footers />
    </>
  );
};

export default Chatbot;
