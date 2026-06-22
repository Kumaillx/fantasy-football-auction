import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import SplashScreen from './screens/SplashScreen';
import PlayerSelection from './screens/PlayerSelection';
import FirstTimeSetup from './screens/FirstTimeSetup';
import Home from './screens/Home';
import Auctions from './screens/Auctions';
import WonAuctions from './screens/WonAuctions';
import Squad from './screens/Squad';
import Settings from './screens/Settings';
import StartAuction from './screens/StartAuction';
import BottomNav from './components/BottomNav';

function AppContent() {
  const { currentUser, firstTimeSetup } = useUser();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/select" element={<PlayerSelection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (firstTimeSetup) {
    return <FirstTimeSetup />;
  }

  return (
    <div className="min-h-screen bg-dark pb-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/won" element={<WonAuctions />} />
        <Route path="/squad" element={<Squad />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/start-auction" element={<StartAuction />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <UserProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </UserProvider>
    </AppProvider>
  );
}

export default App;
