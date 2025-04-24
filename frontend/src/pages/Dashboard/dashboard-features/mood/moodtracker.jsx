import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./mood.css";

// Sample mood data for last 15 days
let moodDataPerDay = {
  "Mar 1": "Joy",
  "Mar 2": "Sadness",
  "Mar 3": "Joy",
  "Mar 4": "Neutral",
  "Mar 5": "Joy",
  "Mar 6": "Fear",
  "Mar 7": "Anger",
  "Mar 8": "Neutral",
  "Mar 9": "Sadness",
  "Mar 10": "Joy",
  "Mar 11": "Fear",
  "Mar 12": "Joy",
  "Mar 13": "Neutral",
  "Mar 14": "Surprise",
  "Mar 15": "Disgust"
};

try {
  const firebase_id = localStorage.getItem('firebase_id');
  
  const res = await fetch(`http://localhost:7777/db/get-last15emo/${firebase_id}`);
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  moodDataPerDay = data;
} catch (err) {
  console.warn("⚠️ Using fallback mood data due to API failure:", err.message);
}
console.log(moodDataPerDay)

// Emotion types
const emotions = [
  "Anger",
  "Disgust",
  "Fear",
  "Joy",
  "Neutral",
  "Sadness",
  "Surprise"
];

// Calculate the total count and average for each emotion
const calculateEmotionData = (moodData) => {
  const emotionCounts = emotions.reduce((acc, emotion) => {
    acc[emotion] = 0;
    return acc;
  }, {});

  // Count each emotion occurrence
  for (let date in moodData) {
    const mood = moodData[date];
    if (emotionCounts[mood] !== undefined) {
      emotionCounts[mood]++;
    }
  }

  // Calculate average for the radar chart (divide count by total days)
  const avgEmotionData = emotions.map((emotion) => {
    const count = emotionCounts[emotion];
    return {
      emotion: emotion,
      value: count // Total count for each emotion
    };
  });

  return avgEmotionData;
};

const EmotionRadarChart = () => {
  const avgMoodData = calculateEmotionData(moodDataPerDay);

  const sortedAvgMoodData = avgMoodData.sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...sortedAvgMoodData.map((data) => data.value));

  return (
    <div className="mood-insights-container">
      <h2 className="mood-insights-title">Mood Insights (Last 15 Days)</h2>
      <div className="mood-insights-content">
        {/* Radar Chart Section */}
        <div className="radar-left">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sortedAvgMoodData}>
              <PolarGrid 
                stroke="#4e4e4e"
                strokeWidth={0.4} 
              />
              <PolarAngleAxis 
                dataKey="emotion" 
                tickLine={false} 
                stroke="#fff" 
                fontSize={12} // Smaller font for labels
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, maxValue+1  ]} 
                tick={false} 
                axisLine={false} 
                stroke="#fff" 
              />
              <Radar
                name="Emotions"
                dataKey="value"
                stroke="#e74c3c" 
                fill="#e74c3c"  
                fillOpacity={0.5}  
                strokeWidth={3}    
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Emotional Stats List */}
        <div className="emotion-stats">
          <h3>Emotional Stats</h3>
          {sortedAvgMoodData.map((data) => (
            <div key={data.emotion} className="emotion-item">
              <span>{data.emotion}</span>
              <span>{data.value} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionRadarChart;
