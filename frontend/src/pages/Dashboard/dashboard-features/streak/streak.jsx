import React, { useEffect, useState } from "react";
import "./d-f.css"; // Styling for the streak section

const Streak = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  // console.log(month)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfMonth = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const formattedDate = `${monthName} ${dayOfMonth}, ${year}`;

  const [streakData, setStreakData] = useState({});

useEffect(() => {
  async function fetchStreak() {
    try {
      const res = await fetch("http://localhost:7777/db/get-streak/nice");
      const data = await res.json();
      console.log(data)
      setStreakData(data);
    } catch (err) {
      console.error("Failed to fetch streak data:", err); 
      setStreakData({
        "2025-04-05": true,
        "2025-04-04": false,
        "2025-04-03": true,
        "2025-04-02": true,
        "2025-04-01": true,
      });
    }
  }

  fetchStreak();
}, []);

  const calculateStreaks = () => {
    let current = 0,
      maxStreak = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      let dateKey = `${year}-03-${i.toString().padStart(2, "0")}`;
      if (streakData[dateKey]) {
        current++;
        maxStreak = Math.max(maxStreak, current);
      } else {
        current = 0;
      }
    }
    return {
      longest: maxStreak,
      current,
      total: Object.values(streakData).filter(Boolean).length,
    };
  };

  const { longest, current, total } = calculateStreaks();

  return (
    <div className="streak-container">
      {/* Streak Stats */}
      <div className="streak-stats">
        <div className="streak-box">
          <h3>🔥 Longest Streak</h3>
          <p>{longest} Days</p>
        </div>
        <div className="streak-box">
          <h3>📅 Current Streak</h3>
          <p>{current} Days</p>
        </div>
        <div className="streak-box">
          <h3>✍️ Total Entries</h3>
          <p>{total} Days</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="maincalendar">
        <div className="calendar-header">
          <h3>{formattedDate}</h3>
        </div>
        <div className="calendar">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateKey = `${year}-${(month + 1)
              .toString()
              .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const hasWritten = streakData[dateKey] || false;

            return (
              <div
                key={day}
                className={`calendar-day ${
                  hasWritten ? "written" : "not-written"
                }`}
                title={hasWritten ? "You wrote on this day" : "No entry"}
                style={{ "--i": i + 1 }}
              >
                <span>{day}</span>
                {!hasWritten && <div className="dot"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Streak;
