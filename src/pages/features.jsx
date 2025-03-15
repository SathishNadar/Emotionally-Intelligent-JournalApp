import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "../css/features.css";

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MoodTracker() {
  const [moodData, setMoodData] = useState([3, 2, 1, 3, 2, 1, 2]); // Default mood levels for 7 days

  // Chart data
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Mood Level",
        data: moodData,
        backgroundColor: ["#ff4081", "#ffca28", "#42a5f5", "#66bb6a", "#ab47bc", "#ef5350", "#26c6da"],
        borderRadius: 10,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: { min: 0, max: 3, ticks: { stepSize: 1, callback: (value) => ["😢", "😐", "😊"][value - 1] } },
    },
  };

  // Function to randomize moods on hover
  const randomizeMood = () => {
    setMoodData(moodData.map(() => Math.floor(Math.random() * 3) + 1));
  };

  return (
    <section className="mood-tracker" onMouseEnter={randomizeMood}>
      <h3>📊 Mood Tracker</h3>
      <p>See how AI tracks your mood over the week!</p>
      <Bar data={data} options={options} />
    </section>
  );
}

function StreakProgress() {
    const [streak, setStreak] = useState(7); // Mock streak value

    // Determine the current milestone range
    let milestone = 10;
    if (streak >= 10) milestone = 30;
    if (streak >= 30) milestone = 50;
    if (streak >= 50) milestone = 100;

    // Calculate progress (streak resets visually but keeps counting)
    const progress = (streak % milestone) / milestone * 100;

    return (
      <section className="streak-section">
        <h3>🔥 Streak Progress</h3>
        <p>Keep your streak going and unlock milestones!</p>

        {/* Progress Bar */}
        <div className="streak-bar-container">
          <div 
            className="streak-bar" 
            style={{ width: `${progress}%` }}>
            <span className="streak-text">{streak} Days</span>
          </div>
        </div>

        {/* Milestone Text */}
        <p className="milestone-text">
          {streak >= 100
            ? "🏆 You've reached the highest milestone!"
            : `🔥 Almost at ${streak < 5 ? "5-Day" : streak < 10 ? "10-Day" : streak < 30 ? "30-Day" : streak < 50 ? "50-Day" : "100-Day"} Badge!`}
        </p>

        {/* Button to Increase Streak */}
        <button className="streak-btn" onClick={() => setStreak(streak + 1)}>
          Increase Streak
        </button>
      </section>
    );
}



  function Recommendations() {
    const recommendationsData = {
        "I'm sad": {
          song: { 
            title: "Fix You", 
            artist: "Coldplay", 
            link: "https://www.youtube.com/watch?v=k4V3Mo61fJM" 
          },
          video: { 
            title: "Overcoming Sadness | Stay Strong", 
            link: "https://www.youtube.com/watch?v=8d0z1rZjgrE" 
          },
          quote: "Tough times don’t last, tough people do."
        },
        "I'm happy": {
          song: { 
            title: "Happy", 
            artist: "Pharrell Williams", 
            link: "https://www.youtube.com/watch?v=ZbZSe6N_BXs" 
          },
          video: { 
            title: "Best Feel-Good Moments", 
            link: "https://www.youtube.com/watch?v=3dcli9i_pvA" 
          },
          quote: "Happiness is not out there, it's in you."
        },
        "I'm stressed": {
          song: { 
            title: "Weightless", 
            artist: "Marconi Union", 
            link: "https://www.youtube.com/watch?v=UfcAVejslrU" 
          },
          video: { 
            title: "Guided Meditation for Stress Relief", 
            link: "https://www.youtube.com/watch?v=inpok4MKVLM" 
          },
          quote: "You are stronger than your stress. Keep going!"
        },
        "I'm motivated": {
          song: { 
            title: "Eye of the Tiger", 
            artist: "Survivor", 
            link: "https://www.youtube.com/watch?v=btPJPFnesV4" 
          },
          video: { 
            title: "Best Motivational Speech Ever", 
            link: "https://www.youtube.com/watch?v=ZXsQAXx_ao0" 
          },
          quote: "Push yourself, because no one else is going to do it for you."
        },
        "I'm feeling low": {
          song: { 
            title: "Rise Up", 
            artist: "Andra Day", 
            link: "https://www.youtube.com/watch?v=kNKu1uNBVkU" 
          },
          video: { 
            title: "Stay Strong | You Got This", 
            link: "https://www.youtube.com/watch?v=n1N_FXb4vGk" 
          },
          quote: "Your present situation is not your final destination. Keep pushing!"
        }
      };

      
    const [selectedMood, setSelectedMood] = useState(null);
  
    return (
      <section className="recommendations">
        <h3>🎵 Get AI Suggestions</h3>
        <p>Select how you feel, and AI will recommend something for you!</p>
        
        <div className="mood-buttons">
          {Object.keys(recommendationsData).map((mood) => (
            <button key={mood} onClick={() => setSelectedMood(mood)}>{mood}</button>
          ))}
        </div>
  
        {selectedMood && (
          <div className="recommendation-box">
            <h4>Suggestions for "{selectedMood}"</h4>
            <p>🎵 Song: <a href={recommendationsData[selectedMood].song.link} target="_blank" rel="noopener noreferrer">
              {recommendationsData[selectedMood].song.title} - {recommendationsData[selectedMood].song.artist}
            </a></p>
            <p>🎥 Video: <a href={recommendationsData[selectedMood].video.link} target="_blank" rel="noopener noreferrer">
              {recommendationsData[selectedMood].video.title}
            </a></p>
            <p>💬 Quote: "{recommendationsData[selectedMood].quote}"</p>
          </div>
        )}
      </section>
    );
  }



export {MoodTracker, Recommendations, StreakProgress};
