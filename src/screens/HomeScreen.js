import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { supabase } from '../firebase.config';
import GalaxyBackground from '../components/GalaxyBackground';
import { runAllTests } from '../utils/testSecurity';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isNelson = user?.email?.includes('nelson');
  const nigeriaTime = moment().utcOffset('+01:00');
  const ukTime = moment().utcOffset('+00:00');
  
  // Quotes Database
  const quotesDatabase = {
    motivational: [
      "Your dreams are valid, no matter the distance between us",
      "Every challenge makes us stronger together",
      "Success is built one day at a time, just like our love",
      "You have the power to achieve anything you set your mind to",
      "Distance is temporary, your potential is limitless",
      "Every step forward is a step closer to our dreams",
      "Believe in yourself as much as I believe in you",
      "Your strength inspires me every single day",
      "Together we can conquer any obstacle",
      "Your future is as bright as your determination"
    ],
    love: [
      "My love for you grows stronger with each passing day",
      "You are my heart, my soul, my everything",
      "Distance means nothing when someone means everything",
      "In your eyes, I found my home",
      "You are the reason I believe in forever",
      "Every heartbeat whispers your name",
      "Our love story is my favorite adventure",
      "You make every day feel like a blessing",
      "With you, I am complete",
      "You are my today and all of my tomorrows"
    ],
    affirmation: [
      "You are worthy of all the love and happiness in the world",
      "Your presence lights up every room you enter",
      "You are capable of amazing things",
      "Your kindness makes the world a better place",
      "You are exactly where you need to be right now",
      "Your voice matters and your thoughts are valuable",
      "You are resilient, strong, and unstoppable",
      "You deserve all the good things coming your way",
      "Your uniqueness is your superpower",
      "You are loved beyond measure"
    ]
  };

  const [currentQuote, setCurrentQuote] = useState('');
  const [quoteType, setQuoteType] = useState('love');
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const rotateQuote = () => {
      const types = ['motivational', 'love', 'affirmation'];
      const currentTypeIndex = types.indexOf(quoteType);
      const quotes = quotesDatabase[quoteType];
      
      if (quoteIndex >= quotes.length - 1) {
        // Move to next category
        const nextTypeIndex = (currentTypeIndex + 1) % types.length;
        setQuoteType(types[nextTypeIndex]);
        setQuoteIndex(0);
      } else {
        setQuoteIndex(prev => prev + 1);
      }
    };

    const timer = setInterval(rotateQuote, 5000);
    return () => clearInterval(timer);
  }, [quoteType, quoteIndex]);

  useEffect(() => {
    setCurrentQuote(quotesDatabase[quoteType][quoteIndex]);
  }, [quoteType, quoteIndex]);

  return (
    <div className="home-container">
      <GalaxyBackground />
      <div className="home-header">
        <h1 className="greeting">
          Welcome NJ
        </h1>
      </div>

      <div className="time-zones">
        <div className={`time-card ${isNelson ? 'active' : ''}`}>
          <h3 className="time-label">Nigeria Time</h3>
          <div className="time">{nigeriaTime.format('HH:mm:ss')}</div>
          <div className="date">{nigeriaTime.format('MMMM Do, YYYY')}</div>
        </div>

        <div className={`time-card ${!isNelson ? 'active' : ''}`}>
          <h3 className="time-label">UK Time</h3>
          <div className="time">{ukTime.format('HH:mm:ss')}</div>
          <div className="date">{ukTime.format('MMMM Do, YYYY')}</div>
        </div>
      </div>

      <div className="quotes-section">
        <div className="quote-type-indicator">
          <span className={`type-badge ${quoteType}`}>
            {quoteType.charAt(0).toUpperCase() + quoteType.slice(1)}
          </span>
        </div>
        <div className="quote-content">
          <div className="quote-text">{currentQuote}</div>
        </div>

      </div>

      <div className="quick-actions">
        <div className="action-card" onClick={() => navigate('/chat')}>
          <div className="action-icon">⚡</div>
          <div className="action-text">Send Message</div>
        </div>
        <div className="action-card" onClick={() => navigate('/gallery')}>
          <div className="action-icon">◉</div>
          <div className="action-text">Share Photo</div>
        </div>
        <div className="action-card" onClick={() => navigate('/games')}>
          <div className="action-icon">▲</div>
          <div className="action-text">Play Games</div>
        </div>
        <div className="action-card" onClick={() => navigate('/profile')}>
          <div className="action-icon">◆</div>
          <div className="action-text">Profile</div>
        </div>
        <div className="action-card" onClick={() => runAllTests()}>
          <div className="action-icon">🔒</div>
          <div className="action-text">Test Security</div>
        </div>
      </div>

      <div className="love-message">
        <p className="love-text">
          "Distance means nothing when someone means everything"
        </p>
      </div>
    </div>
  );
}