import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../Navbar/Navbar";
import "./dashboard.css";
import Streak from "./dashboard-features/streak/streak";
import MoodTracker from "./dashboard-features/mood/moodtracker";
import Footers from "../footer/footers";
import MiniDiary from "./dashboard-features/minidiary/minidiary";
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
    <DashboardNavbar/>
    <div className="dashboard-container">
      <div className="s1"><Streak/></div>
      <div className="s3"><MoodTracker/></div>
      <div className="s2"><MiniDiary/></div>
      <div className="s4">Section 4</div>
      <div className="s5">Section 5</div>
    </div>
    <Footers/>
    </>
  );
};

export default Dashboard;