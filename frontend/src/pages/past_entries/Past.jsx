import React, { useState } from 'react';
import './past.css';
import DashboardNavbar from "../Navbar/Navbar";
import Footers from "../footer/footers";

const diaryEntriesPast = [
  { date: '2025-03-01', content: 'It was a peaceful day. I went on a walk and listened to my favorite music.' },
  { date: '2025-03-02', content: 'Had an intense coding session. AI Diary is starting to feel alive!' },
  { date: '2025-03-03', content: 'Feeling a bit down, but tomorrow is a new day.' },
  { date: '2025-03-04', content: 'Met an old friend after years. We talked for hours and it felt just like the good old days.' },
  { date: '2025-03-05', content: 'Worked out early in the morning. Feeling refreshed and focused.' },
  { date: '2025-03-06', content: 'Watched a beautiful sunset. It reminded me to slow down and enjoy the moment.' },
  { date: '2025-03-07', content: 'Started reading a new book. It’s so captivating I couldn’t put it down.' },
  { date: '2025-03-08', content: 'Struggled with motivation today. Just trying to push through.' },
  { date: 'The beginning after the end', content: 'More to come, more to feel, more to write... This is just the beginning of my story.' }
];

const Past = () => {
  const [currentPagePast, setCurrentPagePast] = useState(0);

  const nextPagePast = () => {
    setCurrentPagePast((prev) => Math.min(prev + 1, diaryEntriesPast.length - 1));
  };

  const prevPagePast = () => {
    setCurrentPagePast((prev) => Math.max(prev - 1, 0));
  };

  const randomPagePast = () => {
    const randomIndex = Math.floor(Math.random() * (diaryEntriesPast.length - 1));
    setCurrentPagePast(randomIndex);
  };

  const handleSliderChangePast = (e) => {
    setCurrentPagePast(Number(e.target.value));
  };

  return (
    <>
      <DashboardNavbar />
      <div className="past-wrapper-past">
        <div className="page-container-past">
          <div className="page-past">
            <div className="date-past">{diaryEntriesPast[currentPagePast].date}</div>
            <div className="content-past">{diaryEntriesPast[currentPagePast].content}</div>
          </div>
        </div>
        <div className="controls-past">
          <button className='btns' onClick={prevPagePast}>Previous</button>
          <div className="minicontrols">
          <input
            type="range"
            min="0"
            max={diaryEntriesPast.length - 1}
            value={currentPagePast}
            onChange={handleSliderChangePast}
            className="slider-past"
          />
          <button className='btns'  onClick={randomPagePast}>Random Page</button>
          </div>
          <button className='btns' onClick={nextPagePast}>Next</button>
        </div>
      </div>
      <Footers />
    </>
  );
};

export default Past;
