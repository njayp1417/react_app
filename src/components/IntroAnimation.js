import React, { useState, useEffect } from 'react';
import './IntroAnimation.css';

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState('nj'); // nj -> zoom -> pop -> complete

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('zoom'), 1000);
    const timer2 = setTimeout(() => setStage('pop'), 2000);
    const timer3 = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="intro-container">
      {/* Galaxy Background */}
      <div className="galaxy-bg">
        <div className="stars"></div>
        <div className="stars2"></div>
      </div>

      {/* NJ Animation */}
      <div className={`nj-animation ${stage}`}>
        <span className="nj-letters">NJ</span>
      </div>
    </div>
  );
}