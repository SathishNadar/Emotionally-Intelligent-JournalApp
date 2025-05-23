import React from "react";
import { useNavigate } from "react-router-dom";
import "./otherFeatures.css";
import DashboardNavbar from "../Navbar/Navbar";
import Footers from "../footer/footers";
import Pomodoro from "./feature-set/pomodoro/pomodoro-timer"
import ToDo from "./feature-set/to-do/to-do-list"
import Spotify from "./feature-set/spotify";
import AI from "./feature-set/chatbot/assistant"

function OtherFeatures() {
  const navigate = useNavigate();

  return (
    <>
    <DashboardNavbar/>
    <div className="features-container">
      <div className="p1 feature-section"><Pomodoro/></div>
      <div className="p2 feature-section"><ToDo/></div>
      <div className="p3 feature-section"><Spotify/></div>
      <div className="p4 feature-section"><AI/></div>
    </div>
    <Footers/>
    </>
  );
}

export default OtherFeatures;