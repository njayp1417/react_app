import React, { useState } from 'react';
import { supabase } from '../firebase.config';
import './AuthScreen.css';

export default function AuthScreen() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrismClick = async (userType) => {
    setSelectedUser(userType);
    setIsAnimating(true);
    
    try {
      // Store the user choice permanently
      localStorage.setItem('userChoice', userType);
      
      // Start Google OAuth for the selected user
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google verification failed: ' + error.message);
      setIsAnimating(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="epic-auth-container">
      {/* Galaxy Background */}
      <div className="auth-galaxy-bg">
        <div className="auth-stars"></div>
        <div className="auth-stars2"></div>
        <div className="auth-stars3"></div>
      </div>

      {/* Floating Orbs - Star Wars Galaxy */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>
      <div className="floating-orb orb-5"></div>

      <div className="auth-content">
        <div className="auth-title-section">
          <h1 className="epic-title">
            <span className="title-nelson">NELSON</span>
            <span className="title-heart">💛</span>
            <span className="title-juliana">JULIANA</span>
          </h1>
          <p className="epic-subtitle">Choose Your Identity</p>
          <div className="title-glow"></div>
        </div>

        <div className="prism-selection">
          <div 
            className={`glass-prism nelson-prism ${selectedUser === 'nelson' ? 'selected' : ''}`}
            onClick={() => !isAnimating && handlePrismClick('nelson')}
          >
            <div className="prism-glow"></div>
            <div className="prism-content">
              <div className="prism-letter">N</div>
              <div className="prism-name">NELSON</div>
            </div>
            {isAnimating && selectedUser === 'nelson' && (
              <div className="prism-loader">
                <div className="loader-ring"></div>
              </div>
            )}
          </div>

          <div className="prism-divider">
            <div className="divider-line"></div>
          </div>

          <div 
            className={`glass-prism juliana-prism ${selectedUser === 'juliana' ? 'selected' : ''}`}
            onClick={() => !isAnimating && handlePrismClick('juliana')}
          >
            <div className="prism-glow"></div>
            <div className="prism-content">
              <div className="prism-letter">J</div>
              <div className="prism-name">JULIANA</div>
            </div>
            {isAnimating && selectedUser === 'juliana' && (
              <div className="prism-loader">
                <div className="loader-ring"></div>
              </div>
            )}
          </div>
        </div>

        <div className="auth-footer">
          <p className="footer-text">Choose your prism for Google verification</p>
          <p className="footer-subtext">"Love knows no distance" ✨</p>
        </div>
      </div>
    </div>
  );
}