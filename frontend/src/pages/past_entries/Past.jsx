import React, { useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './past.css';

const diaryEntries = [
  {
    date: "2025-03-01",
    content: "Today I started building the AI Diary. I'm excited about this project!"
  },
  {
    date: "2025-03-02",
    content: "Worked more on the mood tracking feature. Feeling productive."
  },
  {
    date: "2025-03-03",
    content: "Had a tough day today. But I wrote anyway. Keeping the streak alive!"
  },
];

const Past = () => {
  const bookRef = useRef();

  useEffect(() => {
    // Wait for book to mount
    setTimeout(() => {
      if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flip(1); // Flip to second page (first diary)
      }
    }, 100);
  }, []);

  return (
    <div className="diary-wrapper">
      <HTMLFlipBook
        width={400}
        height={600}
        showCover={true}
        maxShadowOpacity={0.3}
        ref={bookRef}
        className="diary-book"
      >
        {/* Cover page */}
        <div className="page cover">
          <h1>My AI Diary</h1>
          <p>Welcome to your personal journey</p>
        </div>

        {/* Diary entries */}
        {diaryEntries.map((entry, index) => (
          <div className="page" key={index}>
            <div className="date">{entry.date}</div>
            <div className="content">{entry.content}</div>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default Past;
