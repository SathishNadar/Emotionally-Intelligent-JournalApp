import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect, useRef } from 'react';
import "./pomodoro-timer.css"

function PomodoroTimer() {
  const predefinedTimes = [
    { label: "Pomodoro (25 min)", value: 25 * 60 },
    { label: "Short Break (5 min)", value: 5 * 60 },
    { label: "Long Break (15 min)", value: 15 * 60 }
  ];

  const [timeLeft, setTimeLeft] = useState(25 * 60); // default 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(25 * 60);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (audioRef.current) audioRef.current.play();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime);
  };

  const handleSelectChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedTime(value);
    setTimeLeft(value);
  };

  const percentage = ((selectedTime - timeLeft) / selectedTime) * 100;

  return (
    <div className="pomodoro-container">
      <h2>Pomodoro Timer</h2>
      <select onChange={handleSelectChange} value={selectedTime}>
        {predefinedTimes.map((time, idx) => (
          <option key={idx} value={time.value}>{time.label}</option>
        ))}
      </select>
      <div style={{ width: 200, height: 200, margin: '20px auto', position: 'relative' }}>
        <CircularProgressbar
          value={percentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            // textColor: "#333",
            pathColor: "#007bff",
            trailColor: "#d6d6d6"
          })}
        />
      </div>
      <div className="controls">
        <button onClick={handleStartStop}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <audio ref={audioRef} src="/notifications.mp3" preload="auto" />
    </div>
  );
}

export default PomodoroTimer;