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

  const handleSignOut = async () => {
    try {
      // Get current user before signing out
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userType = session.user.user_metadata?.user_type || 
                        (session.user.email?.includes('nelson') ? 'nelson' : 'juliana');
        
        // Set user offline before logout
        await supabase
          .from('user_status')
          .upsert({
            user_id: userType,
            is_online: false,
            last_seen: new Date().toISOString()
          });
      }
      
      // Clear any cached data
      localStorage.removeItem('loveapp_user');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      await supabase.auth.signOut();
    }
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