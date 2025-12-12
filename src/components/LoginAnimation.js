import React, { useState, useEffect } from 'react';
import './LoginAnimation.css';

export default function LoginAnimation({ userName, onComplete }) {
  const [stage, setStage] = useState('initial'); // initial -> expanding -> transitioning -> complete

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('expanding'), 500);
    const timer2 = setTimeout(() => setStage('transitioning'), 2000);
    const timer3 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="login-animation-container">
      <div className="login-galaxy-bg">
        <div className="login-stars"></div>
        <div className="login-stars2"></div>
        <div className="login-stars3"></div>
      </div>

      <div className={`login-prism ${stage}`}>
        <div className="prism-glow-effect"></div>
        <div className="prism-inner">
          <div className="prism-name-display">
            {userName.toUpperCase()}
          </div>
          <div className="prism-welcome">
            Welcome Back
          </div>
        </div>
        <div className="prism-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
      </div>

      {stage === 'transitioning' && (
        <div className="transition-overlay">
          <div className="transition-text">
            Entering Your Universe...
          </div>
        </div>
      )}
    </div>
  );
}