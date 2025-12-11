import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './firebase.config';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import TruthOrDareScreen from './screens/TruthOrDareScreen';
import ProfileScreen from './screens/ProfileScreen';
import GalleryScreen from './screens/GalleryScreen';
import ChatScreen from './screens/ChatScreen';
import Navigation from './components/Navigation';
import IntroAnimation from './components/IntroAnimation';
import './App.css';

function MainApp() {
  return (
    <div className="app">
      <Navigation />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/gallery" element={<GalleryScreen />} />
          <Route path="/games" element={<TruthOrDareScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showIntro, setShowIntro] = useState(true);



  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Server-side security handles authorization
        const userType = session.user.email === 'nelsonasagwara81@gmail.com' ? 'nelson' : 'juliana';
        setUser({ 
          ...session.user, 
          userType,
          displayName: userType === 'nelson' ? 'Nelson' : 'Juliana'
        });
        // Set online status
        supabase.from('user_status').upsert({
          user_id: userType,
          is_online: true,
          last_seen: new Date().toISOString()
        });
        localStorage.removeItem('selectedUserType');
      }
      setInitializing(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Server-side security handles authorization
          const userType = session.user.email === 'nelsonasagwara81@gmail.com' ? 'nelson' : 'juliana';
          setUser({ 
            ...session.user, 
            userType,
            displayName: userType === 'nelson' ? 'Nelson' : 'Juliana'
          });
          await supabase.from('user_status').upsert({
            user_id: userType,
            is_online: true,
            last_seen: new Date().toISOString()
          });
          localStorage.removeItem('selectedUserType');
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (initializing) return <div className="loading">Loading...</div>;

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <Router>
      {user ? <MainApp /> : <AuthScreen />}
    </Router>
  );
}