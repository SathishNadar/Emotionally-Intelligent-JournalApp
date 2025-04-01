import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./mood.css";

const moodData = [
    { date: "Mar 18", mood: 1 },
    { date: "Mar 19", mood: 2 },
    { date: "Mar 20", mood: 3 },
    { date: "Mar 21", mood: 1 },
    { date: "Mar 22", mood: 2 },
    { date: "Mar 23", mood: 3 },
    { date: "Mar 24", mood: 2 },
    { date: "Mar 25", mood: 1 },
    { date: "Mar 26", mood: 3 },
    { date: "Mar 27", mood: 2 },
    { date: "Mar 28", mood: 1 },
    { date: "Mar 29", mood: 3 },
    { date: "Mar 30", mood: 2 },
    { date: "Mar 31", mood: 1 },
    { date: "Apr 1", mood: 3 }
  ];
  

const MoodTracker = () => {
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    setShowLine(false);
    setTimeout(() => {
      setShowLine(true); // Start the line animation
    }, 1200);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const moodText = moodValue === 1 ? "Sad 😢" : moodValue === 2 ? "Neutral 😐" : "Happy 😊";
      return (
        <div className="custom-tooltip">
          <p>{moodText}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mood-tracker-container">
      <h3 className="mood-tracker-title">Mood Insights (Recent 15 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={moodData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="date" tick={{ fill: "#ccc", fontSize: 12 }} />
          <YAxis
            tickFormatter={(tick) => (tick === 1 ? "😢" : tick === 2 ? "😐" : "😊")}
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tick={{ fontSize: 16 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Animated Line */}
          {showLine && (
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#6c5ce7"
              strokeWidth={3}
              isAnimationActive={true}
              animationDuration={1500}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTracker;
