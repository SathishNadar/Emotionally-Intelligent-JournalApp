import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import { MoodTracker, Recommendations, StreakProgress } from "../Features/features";
import Footers from "../footer/footers";

function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const texts = ["Diary", "Consultant", "Assistant"];
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    const currentWord = texts[wordIndex];

    let typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        // Typing
        setCurrentText((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        setCurrentText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % texts.length); // Cycle words
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      {/* Navbar */}
      <header>
        <h1>AI Diary</h1>
        <nav>
          <button className="auth-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="auth-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero">
          <div className="animated-text">
            AI {currentText}
            <span className="cursor"></span> {/* Blinking cursor */}
          </div>
          <p>
            Write your thoughts, track your mood, and get uplifting suggestions
            when you need them.
          </p>
          <button className="start-btn" onClick={() => navigate("/signup")}>
            Start Your Journey
          </button>
        </section>

        {/* About Section */}
        <section className="about">
          <h3>About AI Diary</h3>
          <p>
            AI Diary is your personal space to express your thoughts and
            emotions. Using advanced AI-powered sentiment analysis, it tracks
            your mood and provides uplifting content when you're feeling low.
          </p>
        </section>

        {/* Features Section */}
        <div className="features">
          <h1>Features</h1>
        </div>

        <section>
          <MoodTracker />
        </section>
        <section>
          <Recommendations />
        </section>
        <section>
          <StreakProgress />
        </section>

        {/* Benefits Section */}
        <section className="benefits">
          <h3>🌟 Why Choose AI Diary?</h3>
          <div className="benefits-container">
            <div className="benefit-card">
              <span className="icon">💡</span>
              <h4>AI-Powered Insights</h4>
              <p>Understand your emotions better with AI mood tracking.</p>
            </div>

            <div className="benefit-card">
              <span className="icon">🔒</span>
              <h4>100% Private & Secure</h4>
              <p>Your diary is encrypted and completely confidential.</p>
            </div>

            <div className="benefit-card">
              <span className="icon">🎧🎷</span>
              <h4>Smart Recommendations</h4>
              <p>Get uplifting songs, videos & quotes based on your mood.</p>
            </div>

            <div className="benefit-card">
              <span className="icon">📅</span>
              <h4>Streak & Habit Building</h4>
              <p>Track your daily journaling progress & reach milestones.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footers/>
    </div>
  );
}

export default Home;
