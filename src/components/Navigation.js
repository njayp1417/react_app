import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../firebase.config';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '◆', label: 'Home' },
    { path: '/chat', icon: '⚡', label: 'Chat' },
    { path: '/gallery', icon: '◉', label: 'Gallery' },
    { path: '/games', icon: '▲', label: 'Games' },
    { path: '/profile', icon: '●', label: 'Profile' },
  ];

  const handleSignOut = () => {
    console.log('Signing out...');
    localStorage.clear();
    sessionStorage.clear();
    supabase.auth.signOut();
    window.location.href = window.location.origin;
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Nelson & Juliana</h2>
        <p>Our Love Story</p>
      </div>
      
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-footer">
        <button className="sign-out-btn" onClick={handleSignOut}>
          ◇ Sign Out
        </button>
      </div>
    </nav>
  );
}