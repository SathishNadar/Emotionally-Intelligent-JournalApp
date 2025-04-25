import React, { useState, useEffect } from "react";
import "./diary.css";
import DashboardNavbar from "../Navbar/Navbar";
import Footers from "../footer/footers";

const AIDiary = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [entryText, setEntryText] = useState("");
  const [savedEntries, setSavedEntries] = useState([]); // Store submitted entries

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    // Load saved entry from session
    const saved = sessionStorage.getItem("diaryEntry");
    if (saved) setEntryText(saved);
  }, []);

  const handleInputChange = (e) => {
    setEntryText(e.target.value);
    sessionStorage.setItem("diaryEntry", e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline

      const newEntry = {
        date: currentDate,
        text: entryText.trim(),
      };

      setSavedEntries((prev) => [...prev, newEntry]);
      console.log("Saved entry:", newEntry);

      // You could also send to backend here

      // Optionally clear textarea after saving:
      // setEntryText("");
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="diary-container">
        <div className="diary-page-three">
          <div className="diary-date">{currentDate}</div>
          <div className="diary-content">{entryText}</div>
        </div>
        <textarea
          className="diary-input"
          placeholder="Write your thoughts here..."
          value={entryText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Footers />
    </>
  );
};

export default AIDiary;
