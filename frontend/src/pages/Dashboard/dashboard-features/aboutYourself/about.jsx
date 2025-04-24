import React, { useState, useEffect, useRef } from "react";
import "./about.css";

const allQuestions = [
  "What is my specialty?",
  "Tell me about myself.",
  "What makes me happy?",
  "What am I afraid of?",
  "What do I value most in life?",
  "How do I react under pressure?",
  "What is my proudest moment?",
  "What are my biggest regrets?",
  "What do I love about myself?",
  "How do I handle failure?"
];

const dummyAnswers = {
  "What is my specialty?": "Your specialty lies in your unique ability to connect deeply with others and understand emotions on a profound level.",
  "Tell me about myself.": "You are a curious, introspective soul who is constantly learning, growing, and embracing the journey of self-discovery.",
  "What makes me happy?": "Simple moments, meaningful conversations, and creative expression light up your spirit and bring you joy.",
  "What am I afraid of?": "You're often afraid of not living up to your potential or disappointing those you care about.",
  "What do I value most in life?": "Authenticity, connection, creativity, and inner peace are the pillars you live by.",
  "How do I react under pressure?": "You tend to remain calm and composed, taking a step back to assess the situation before reacting.",
  "What is my proudest moment?": "Your proudest moment was when you achieved something you had worked hard for and received recognition for your effort.",
  "What are my biggest regrets?": "You regret not taking more risks when you had the chance, but you’ve learned to see every experience as valuable.",
  "What do I love about myself?": "You love your resilience, creativity, and ability to empathize with others.",
  "How do I handle failure?": "You view failure as an opportunity for growth and self-improvement, focusing on lessons learned."
};

const About = () => {
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [usedIndexes, setUsedIndexes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    let available = allQuestions.map((q, i) => ({ q, i }))
      .filter(({ i }) => !usedIndexes.includes(i));

    if (available.length === 0) {
      setUsedIndexes([]);
      available = allQuestions.map((q, i) => ({ q, i }));
    }

    const newSelection = [];
    const newIndexes = [];

    while (newSelection.length < 5 && available.length > 0) {
      const rand = Math.floor(Math.random() * available.length);
      const { q, i } = available.splice(rand, 1)[0];
      newSelection.push(q);
      newIndexes.push(i);
    }

    setVisibleQuestions(newSelection);
    setUsedIndexes(prev => [...prev, ...newIndexes]);
    setCurrentQuestion(null);
    setShowingAnswer(false);
  };

  const showAnswer = (q) => {
    setCurrentQuestion(q);
    setShowingAnswer(true);
    timeoutRef.current = setTimeout(() => {
      generateQuestions();
    }, 7 * 60 * 1000); // Automatically generates new questions after 7 minutes
  };

  const closeAnswer = () => {
    clearTimeout(timeoutRef.current);
    generateQuestions();
  };

  return (
    <div className="section4-wrapper">
      <h2 className="header">Ask Anything to AI Diary</h2>
      {!showingAnswer ? (
        <div className="question-chips">
          {visibleQuestions.map((q, idx) => (
            <button key={idx} className="chip" onClick={() => showAnswer(q)}>
              {q}
            </button>
          ))}
        </div>
      ) : (
        <div className="answer-box">
          <button className="close-btn" onClick={closeAnswer}>✖</button>
          <h3>{currentQuestion}</h3>
          <p>{dummyAnswers[currentQuestion]}</p>
        </div>
      )}
    </div>
  );
};

export default About;
