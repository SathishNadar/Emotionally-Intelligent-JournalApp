import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./minidiary.css";

const MiniDiary = () => {
  const [entry, setEntry] = useState("");
  const navigate = useNavigate();

  // Simulate fetching a past entry
  const pastEntries = [
    "Today felt a little overwhelming, but I managed to push through.",
    "The sunset was really beautiful today, made me feel at peace.",
    "Felt a bit off today, not sure why. Hoping for a better tomorrow.",
  ];
  const [pastEntry, setPastEntry] = useState("");

  useEffect(() => {
    setPastEntry(pastEntries[Math.floor(Math.random() * pastEntries.length)]);
  }, []);

  const handleSubmit = () => {
    if (entry.trim() !== "") {
      sessionStorage.setItem("draftEntry", entry);
      navigate("/diary");
    }
  };

  return (
    <div className="mini-diary-container">
      <h2 className="mini-diary-title">Your Recent Thoughts</h2>
      
      {/* Past entry preview */}
      <div className="mini-diary-preview">
        <div className="mini-diary-avatar">📝</div>
        <div className="mini-diary-entry">
          <span className="mini-diary-timestamp">Yesterday</span>
          <p className="mini-diary-text">{pastEntry}</p>
        </div>
      </div>

      {/* Input Box */}
      <textarea
        className="mini-diary-textarea"
        placeholder="Write something..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <button className="mini-diary-button" onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default MiniDiary;
