import React, { useState, useEffect } from 'react';
import { supabase } from '../firebase.config';
import GalaxyBackground from '../components/GalaxyBackground';
import './ProfileScreen.css';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const isNelson = user?.email?.includes('nelson');

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="profile-container">
      <GalaxyBackground />
      
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">NJ</span>
        </div>
        <h1 className="profile-title">Nelson & Juliana</h1>
        <p className="profile-subtitle">Love Ain't Rocket Science</p>
      </div>

      <div className="about-section">
        <div className="about-card">
          <h2 className="section-title">Our Story</h2>
          <p className="about-text">
            We're Nelson & Juliana—a couple who found each other after navigating the wild world of modern dating and mental health challenges. 
            He brings analytical insight with a touch of dark humor, she cuts through nonsense with warmth and wit.
          </p>
          <p className="about-text">
            We're not relationship gurus or therapists—just two people who've learned some things the hard way and want to share what works. 
            Think of us as your dating and mental health translators, turning complicated psychology into advice you'll actually use.
          </p>
        </div>
      </div>

      <div className="founders-section">
        <h2 className="section-title">The Disaster Duo</h2>
        <div className="founders-grid">
          <div className="founder-card nelson-card">
            <div className="founder-avatar nelson-avatar">
              <span>N</span>
            </div>
            <h3>Nelson</h3>
            <p>Self-proclaimed psychopath who somehow gives great relationship advice. Enjoys solitude but can't stop analyzing why people do what they do. Has made every dating mistake in the book so you don't have to.</p>
          </div>
          
          <div className="founder-card juliana-card">
            <div className="founder-avatar juliana-avatar">
              <span>J</span>
            </div>
            <h3>Juliana</h3>
            <p>The voice of reason with a wild side. Has a talent for seeing through people's BS and calling it out with love. Collects relationship horror stories like some people collect stamps.</p>
          </div>
        </div>
      </div>

      <div className="mission-section">
        <div className="mission-card">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">
            We're a couple who got tired of seeing people struggle with the same relationship and mental health issues we've faced. 
            Our mission? Make this stuff less intimidating and more fun to talk about. No credentials, just real talk and resources that actually help.
          </p>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">What We're About</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">◆</div>
            <h3>No BS Dating Talk</h3>
            <p>Dating advice that doesn't sound like it came from your grandma or a robot. Real talk about ghosting, texting anxiety, and modern love.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">◉</div>
            <h3>Brain Stuff Made Simple</h3>
            <p>Mental health doesn't have to be all serious and clinical. We break down the psychology behind relationships in ways you'll actually understand.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">▲</div>
            <h3>Laughing Through The Pain</h3>
            <p>Sometimes the best way to deal with relationship drama is to find the humor in it all. We've been there, and we've got the stories to prove it.</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2 className="section-title">Our Journey</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">6</div>
            <div className="stat-label">Years Together</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">Years Apart</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">∞</div>
            <div className="stat-label">Love Shared</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Continents</div>
          </div>
        </div>
      </div>

      <div className="quote-section">
        <div className="quote-card">
          <p className="quote-text">
            "We're just two people sharing what we've learned. If you need professional help, please seek it out. 
            But if you need someone to tell you that your dating life isn't as hopeless as it seems, we're here for that."
          </p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="sign-out-btn" onClick={handleSignOut}>
          ◇ Sign Out
        </button>
      </div>
    </div>
  );
}